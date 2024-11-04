import React, { useEffect, useRef, useState,useMemo, useCallback } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Alert, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform, View, TextInput, FlatList, Text } from 'react-native';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import { apiFetch } from '../(ApiRes)/apiConfig';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

const INITIAL_REGION = {
  latitude: -17.3895,
  longitude: -66.1568,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};
type Pharmacy = {
  id: number;
  name: string;
  address: string;
  codeZona: string;
  healthNetwork: string;
  latitude: number;
  longitude: number;
  personName: string;
  personLastName: string;
  phone: string;
  sectorName: string;
  status: number;
  townName: string;
  typePharmacy: string;
  userName: string;
  zonaName: string;
};
type Town = {
  id: string;
  name: string;
}



function HomeScreen() {
  const mapRef = useRef<MapView>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState('');
 
  type PharmacyData = {
    latitude: string;
    longitude: string;

  };


  //para el modal
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['1%','30%'], []);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [townData, setDateTown] = useState<Town[]>([]);
  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };
  const openBottomSheet = (phar: Pharmacy) => {
    setSelectedPharmacy(phar);
    console.log("dataadasd:",phar)
    bottomSheetRef.current?.expand(); // Abre el bottom sheet
  };


  ///para recuperar las farmacias
  const [usepharmacy, setPharmacy] = useState([])
  const [usepharmacyFilter, setPharmacyFilter] = useState([])
  const [useFilterBack, setFilterBack] = useState(false)
  const [useSearchPhar, setSearchPhar] = useState([]) //lista de nombre por filtrar
  const [searchQuery, setSearchQuery] = useState('');
  const getFarmacy = async () => {
    try {

      const storedUser = await AsyncStorage.getItem('user');
      const userData = JSON.parse(storedUser); // Asegúrate de parsear el objeto almacenado
      console.info(userData)
      const bodyData = {
        id: userData.id,
        role: userData.role,
      };

      const data = await apiFetch('/getFarmacyByUser', {
        method: 'POST', // Cambia a POST para enviar datos en el cuerpo de la solicitud
        body: JSON.stringify(bodyData), // Enviar el id y role en el cuerpo de la solicitud
      });


      if (data) {
        // Convertir latitude y longitude a números en cada farmacia
        const formattedData = data.map((item: PharmacyData) => ({
          ...item,
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
        }));
  
        console.log("datos de la farmacia:", formattedData);
        setPharmacy(formattedData)
        setPharmacyFilter(formattedData)
      } else {
        console.log("No se encontró ningúna Farmacia.");
      }

      
    } catch (error) {
      console.error("Error al recuperar los datos:", error);
    }
  };
  const getTown = async () => {
    try {
      const data  = await apiFetch("/getTow", {
        method: "GET",
      });

      if (data) {
       
        setDateTown(data);
      } else {
        console.log("No se encontró ningúna ciudad.");
      }
    } catch (error) {
      console.error("Error al recuperar los datos de Farmacias:", error);
    }
  };

  const pharmacyFilterTown = (town: string) => {
    const filteredPharmacies = usepharmacy.filter((pharmacyl: Pharmacy) => pharmacyl.townName === town );
    setPharmacyFilter(filteredPharmacies);
    setFilterBack(true)
  };

  const searchFilterName = (text: string) => {
    setSearchQuery(text)

    if(text !== ""){

      const filteredDataName = usepharmacy.filter((farmacia: Pharmacy) =>
        farmacia.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if(filteredDataName.length != 0){
        setSearchPhar(filteredDataName)
      }else{
        setSearchPhar([])
      }

    }else{
      setSearchPhar([])
    }
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useFocusEffect(
    useCallback(() => {
        getFarmacy();
        getTown();
    }, [])
  );

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permiso de Ubicación',
          message: 'La aplicación necesita acceso a tu ubicación para mostrar tu posición en el mapa.',
          buttonNeutral: 'Preguntar después',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const highAccuracyGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
        );
        if (highAccuracyGranted === PermissionsAndroid.RESULTS.GRANTED) {
          setLocationPermission(true);
          getUserLocation();
        } else {
          Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación de alta precisión.');
        }
      } else {
        Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación.');
      }
    } else {
      setLocationPermission(true);
      getUserLocation();
    }
  };
  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación.');
    }
  };

  const centerUserLocation = () => {
    if (currentLocation) {
      mapRef.current?.animateCamera({
        center: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        zoom: 15,
      }, { duration: 1000 });
    } else {
      Alert.alert('Ubicación no disponible', 'No se pudo obtener la ubicación del usuario.');
    }
  };

  const onMarkerSelected = (marker: Pharmacy) => {
    mapRef.current?.animateCamera({
      center: {
        latitude: marker.latitude,
        longitude: marker.longitude,
      },
      zoom: 17,
    }, { duration: 1000 });
  };


  const onSearchResultSelect = (marker: Pharmacy) => {
    onMarkerSelected(marker);
    setSearchQuery('');
    setSearchPhar([])
  };

  const resetFilters = () => {
    setFilterBack(false)
    setPharmacyFilter(usepharmacy)
    setSearchQuery('');
    setSelectedMunicipio('');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
  
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        showsUserLocation={locationPermission}
        showsMyLocationButton={false}
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
      >
       {usepharmacyFilter.map((marker: Pharmacy) => (
          <Marker
            key={marker.id}
            coordinate={{  latitude: marker.latitude,  longitude: marker.longitude }}
            pinColor="blue"
            onPress={() => openBottomSheet(marker)}
          />
        ))}

      </MapView>

      <TouchableOpacity style={styles.locationButton} onPress={centerUserLocation}>
        <Icon name="bullseye" size={24} color="red" />
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar farmacia..."
          value={searchQuery}
          onChangeText={searchFilterName}
        />

        <Picker
        selectedValue={selectedMunicipio}
        onValueChange={(itemValue) => {
          setSelectedMunicipio(itemValue);
          pharmacyFilterTown(itemValue);
        }}
        style={styles.picker}>

        {selectedMunicipio === "" && <Picker.Item label="Seleccionar Municipio" value="" />}
        {townData.map((municipio) => (
          <Picker.Item key={municipio.id} label={municipio.name} value={municipio.name} />
        ))}
        
      </Picker>


        {useSearchPhar.length > 0 && useSearchPhar && (
          <FlatList
            style={styles.searchResults}
            data={useSearchPhar}
            keyExtractor={(item:Pharmacy) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onSearchResultSelect(item)}>
                <Text style={styles.searchResultItem}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}


      </View>


      {useFilterBack && (
        <TouchableOpacity style={styles.clearButton} onPress={resetFilters}>
          <Text style={styles.clearButtonText}>Quitar Filtros</Text>
        </TouchableOpacity>
      )}


     {/* Bottom Sheet */}
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onClose={closeBottomSheet}
      enablePanDownToClose={true}
    >
      <BottomSheetView style={styles.container}>
        {selectedPharmacy && (
          <View style={styles.card}>
            
           {/* Header */}
           <View style={styles.header}>
              <Text style={styles.name}>{selectedPharmacy.name}</Text>
              <Text style={styles.type}>{selectedPharmacy.typePharmacy}</Text>
            </View>

            {/* Address Section */}
            <View style={styles.section}>
              <Entypo name="address" size={24} color="#4CAF50"  />
              <Text style={styles.sectionText}>{selectedPharmacy.address}</Text>           
            </View>

            {/* Contact Section */}
            <View style={styles.section}>
              <Icon name="phone" size={24} color="#2196F3" />
              <Text style={styles.sectionText}>{selectedPharmacy.phone}</Text>
            </View>

            {/* Additional Info */}
            <View style={styles.row}>
              <View style={styles.additionalInfo}>
                 <MaterialIcons name="location-city" size={24} color="#2196F3"  />
                <Text style={styles.additionalText}>{selectedPharmacy.townName}</Text>
              </View>
              <View style={styles.additionalInfo}>
                <MaterialIcons name="place" size={20} color="#9C27B0" />
                <Text style={styles.additionalText}>{selectedPharmacy.zonaName}</Text>
              </View>
              <View style={styles.additionalInfo}>
                <MaterialIcons name="health-and-safety" size={20} color="#F44336"/>
                <Text style={styles.additionalText}>{selectedPharmacy.healthNetwork}</Text>       
              </View>
            </View>

            {/* Status */}
            <View style={styles.statusContainer}>
              <Icon
                name="check-circle"
                size={24}
                color={selectedPharmacy.status === 1 ? "green" : "red"}
              />
              <Text style={styles.statusText}>
                {selectedPharmacy.status === 1 ? "Activo" : "Inactivo"}
              </Text>
            </View>

          </View>
        )}
      </BottomSheetView>
    </BottomSheet>

 </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  locationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    elevation: 5,
  },
 searchInput: {
   height: 40,
   borderColor: '#ccc',
   borderWidth: 1,
   borderRadius: 8,
   paddingHorizontal: 10,
 },
 picker: {
   height: 50,
   width: '100%',
   backgroundColor: '#f1f1f1',
   borderRadius: 8,
   marginTop: 10,
 },
 searchResults: {
   maxHeight: 150,
 },
 searchResultItem: {
   padding: 10,
   borderBottomColor: '#ccc',
   borderBottomWidth: 1,
 },
  clearButton: {
    position: 'absolute',
    bottom: 70,
    left: 10,
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },


  ///para el modal
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  type: {
    fontSize: 16,
    color: 'gray',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  sectionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  additionalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  additionalText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  }
});

export default HomeScreen;
