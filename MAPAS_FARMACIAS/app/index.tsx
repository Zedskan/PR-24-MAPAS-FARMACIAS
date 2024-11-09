import React, { useEffect, useRef, useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Alert, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform, View, TextInput, FlatList, Text } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import SlidingPanel from './SlidingPanel';
import { markers, Marker1 } from './MarkerData';
import { Picker } from '@react-native-picker/picker';
import * as Notifications from 'expo-notifications';

const INITIAL_REGION = {
  latitude: -17.3895,
  longitude: -66.1568,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const municipios = [
  'Cochabamba', 'Sacaba', 'Quillacollo', 'Villa Tunari', 'Tiquipaya',
  'Colcapirhua', 'Vinto', 'Puerto Villarroel', 'Sipe Sipe', 'Entre Ríos', 
  'Punata', 'Mizque', 'Tapacarí', 'Independencia', 'Aiquile', 'Cliza', 
  'Chimoré', 'Tiraque', 'Shinahota', 'Capinota', 'Colomi', 'Cocapata',
  'Arbieto', 'Totora', 'San Benito', 'Morochata', 'Pocona', 'Arque', 
  'Tacopaya', 'Pojo'
];

export default function App() {
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Marker1 | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMarkers, setFilteredMarkers] = useState<Marker1[]>(markers);
  const [selectedMunicipio, setSelectedMunicipio] = useState('');

  useEffect(() => {
    requestLocationPermission();
    requestNotificationPermission(); // Pedir permiso para notificaciones
    listenForPharmacyChanges(); // Simular cambios en las farmacias y notificar
  }, []);

  useEffect(() => {
    const filtered = markers.filter(marker => {
      const matchesQuery = marker.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMunicipio = selectedMunicipio ? marker.municipio === selectedMunicipio : true;
      return matchesQuery && matchesMunicipio;
    });
    setFilteredMarkers(filtered);
  }, [searchQuery, selectedMunicipio]);

  const requestLocationPermission = async () => {
    console.log("Requesting location permission...");
    try {
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
          console.log("Location permission granted.");
          setLocationPermission(true);
          getUserLocation();
        } else {
          console.log("Location permission denied.");
          Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación.');
        }
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log("Location permission status:", status);
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación.');
          return;
        }
        setLocationPermission(true);
        getUserLocation();
      }
    } catch (error) {
      console.warn("Error requesting location permission:", error);
    }
  };

  const getUserLocation = async () => {
    console.log("Getting user location...");
    try {
      const location = await Location.getCurrentPositionAsync({});
      console.log("User location:", location);
      setCurrentLocation(location.coords);
    } catch (error) {
      console.log("Error getting user location:", error);
      Alert.alert('Error', 'No se pudo obtener la ubicación.');
    }
  };

  const centerUserLocation = () => {
    console.log("Centering map on user location...");
    if (currentLocation) {
      mapRef.current?.animateCamera({
        center: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        zoom: 17,
      }, { duration: 1000 });
    } else {
      Alert.alert('Ubicación no disponible', 'No se pudo obtener la ubicación del usuario.');
    }
  };

  const onMarkerSelected = (marker: Marker1) => {
    console.log("Selected marker:", marker);
    setSelectedMarker(marker);
    setPanelVisible(true);
    mapRef.current?.animateCamera({
      center: {
        latitude: marker.latitude,
        longitude: marker.longitude,
      },
      zoom: 17,
    }, { duration: 1000 });
  };

  const closePanel = () => {
    console.log("Closing marker info panel...");
    setPanelVisible(false);
    setSelectedMarker(null);
  };

  const onSearchResultSelect = (marker: Marker1) => {
    console.log("Search result selected:", marker);
    onMarkerSelected(marker);
    setSearchQuery('');  // Limpiar la barra de búsqueda
  };

  const resetFilters = () => {
    console.log("Resetting filters...");
    setSearchQuery('');
    setSelectedMunicipio('');
  };

  const shouldShowClearButton = () => {
    return selectedMunicipio.length > 0 || searchQuery.length > 0;
  };

  const requestNotificationPermission = async () => {
    console.log("Requesting notification permission...");
    const { status } = await Notifications.requestPermissionsAsync();
    console.log("Notification permission status:", status);
    if (status !== 'granted') {
      Alert.alert('Permiso de notificación denegado', 'No se pueden mostrar notificaciones sin permisos.');
    }
  };

  const listenForPharmacyChanges = () => {
    console.log("Listening for pharmacy changes...");
    setTimeout(() => {
      console.log("Simulating pharmacy change...");
      sendNotification('Cambio de turno', 'La farmacia cercana ha cambiado su turno.');
    }, 5000);
  };

  const sendNotification = async (title: string, body: string) => {
    try {
      await Notifications.presentNotificationAsync({
        title: title,
        body: body,
      });
      console.log(`Sending notification: ${title} - ${body}`);
      console.log("Notification sent successfully.");
    } catch (error) {
      console.log("Error sending notification:", error);
    }
  };
  
  const handleNotificationButtonPress = () => {
    console.log("Notification button pressed.");
    sendNotification('Notificación Simulada', 'Esta es una notificación simulada.');
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        showsUserLocation={locationPermission}
        showsMyLocationButton={false}
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        scrollEnabled={!panelVisible}
      >
        {filteredMarkers.map((marker: Marker1) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            pinColor="blue"
            onPress={() => onMarkerSelected(marker)}
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.locationButton} onPress={centerUserLocation}>
        <Icon name="bullseye" size={24} color="blue" />
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar farmacia..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Picker
          selectedValue={selectedMunicipio}
          onValueChange={(itemValue) => setSelectedMunicipio(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccionar Municipio" value="" />
          {municipios.map((municipio) => (
            <Picker.Item key={municipio} label={municipio} value={municipio} />
          ))}
        </Picker>
        {searchQuery.length > 0 && (
          <FlatList
            style={styles.searchResults}
            data={filteredMarkers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onSearchResultSelect(item)}>
                <Text style={styles.searchResultItem}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        {shouldShowClearButton() && (
          <TouchableOpacity style={styles.clearButton} onPress={resetFilters}>
            <Text style={styles.clearButtonText}>Limpiar filtros</Text>
          </TouchableOpacity>
        )}
        
         {panelVisible && selectedMarker && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000 }}>
        <SlidingPanel
          marker={selectedMarker}
          onClose={closePanel}
          visible={panelVisible}
        />
      </View>
      )}
      </View>

      {selectedMarker && panelVisible && (
        <SlidingPanel marker={selectedMarker} onClose={closePanel} visible={false} />
      )}
      
      
      
        {/* <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationButtonPress}> //Boton Enviar Notifiacion 
           <Text style={styles.notificationButtonText}>Enviar notificación</Text>
        </TouchableOpacity> */}

      

    </View>
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
    zIndex: 1000,
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    zIndex: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 40,
    marginBottom: 10,
  },
  searchResults: {
    maxHeight: 200,
  },
  searchResultItem: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
  },
  clearButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  notificationButton: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: [{ translateX: -75 }],
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
    zIndex: 1000,
  },
  notificationButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
