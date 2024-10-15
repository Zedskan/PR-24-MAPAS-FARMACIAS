import React, { useEffect, useRef, useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Alert, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform, View, TextInput, FlatList, Text } from 'react-native';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/FontAwesome';
import SlidingPanel from './SlidingPanel';
import { markers, Marker1 } from './MarkerData';
import { Picker } from '@react-native-picker/picker';

const INITIAL_REGION = {
  latitude: -17.3895,
  longitude: -66.1568,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const municipios = [
  'Cochabamba',
  'Sacaba',
  'Quillacollo',
  'Villa Tunari',
  'Tiquipaya',
  'Colcapirhua',
  'Vinto',
  'Puerto Villarroel',
  'Sipe Sipe',
  'Entre Ríos',
  'Punata',
  'Mizque',
  'Tapacarí',
  'Independencia',
  'Aiquile',
  'Cliza',
  'Chimoré',
  'Tiraque',
  'Shinahota',
  'Capinota',
  'Colomi',
  'Cocapata',
  'Arbieto',
  'Totora',
  'San Benito',
  'Morochata',
  'Pocona',
  'Arque',
  'Tacopaya',
  'Pojo'
];

function HomeScreen() {
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
        zoom: 17,
      }, { duration: 1000 });
    } else {
      Alert.alert('Ubicación no disponible', 'No se pudo obtener la ubicación del usuario.');
    }
  };

  const onMarkerSelected = (marker: Marker1) => {
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
    setPanelVisible(false);
    setSelectedMarker(null);
  };

  const onSearchResultSelect = (marker: Marker1) => {
    onMarkerSelected(marker);
    setSearchQuery('');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedMunicipio('');
  };

  const shouldShowClearButton = () => {
    return selectedMunicipio.length > 0 || searchQuery.length > 0;
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
      </View>

      {shouldShowClearButton() && (
        <TouchableOpacity style={styles.clearButton} onPress={resetFilters}>
          <Text style={styles.clearButtonText}>Quitar Filtros</Text>
        </TouchableOpacity>
      )}

      {panelVisible && selectedMarker && (
        <SlidingPanel
          marker={selectedMarker}
          onClose={closePanel}
          visible={panelVisible}
        />
      )}
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
});

export default HomeScreen;
