import React, { useEffect, useRef, useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Alert, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform, View } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';// Asegúrate de que el path sea correcto
import SlidingPanel from './SlidingPanel'; // Importa el nuevo componente
import { markers, Marker1 } from './MarkerData';

const INITIAL_REGION = {
  latitude: -17.3895,
  longitude: -66.1568,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

export default function App() {
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Marker1 | null>(null); // Cambia aquí
  const [panelVisible, setPanelVisible] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
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
          setLocationPermission(true);
          getUserLocation();
        } else {
          Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación.');
        }
      } catch (err) {
        console.warn(err);
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
      console.log(error);
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

  const onMarkerSelected = (marker: Marker1) => { // Cambia aquí
    setSelectedMarker(marker);
    setPanelVisible(true); // Abre la ventana deslizante
    mapRef.current?.animateCamera({
      center: {
        latitude: marker.latitude,
        longitude: marker.longitude,
      },
      zoom: 17,
    }, { duration: 1000 });
  };

  const closePanel = () => {
    setPanelVisible(false); // Cierra la ventana deslizante
    setSelectedMarker(null);
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
        {markers.map((marker : Marker1) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            pinColor="blue"
            onPress={() => onMarkerSelected(marker)} // Cambia aquí
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.locationButton} onPress={centerUserLocation}>
        <Icon name="bullseye" size={24} color="blue" />
      </TouchableOpacity>

      <SlidingPanel visible={panelVisible} marker={selectedMarker} onClose={closePanel} />
    </View>
  );
}

const styles = StyleSheet.create({
  locationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});
