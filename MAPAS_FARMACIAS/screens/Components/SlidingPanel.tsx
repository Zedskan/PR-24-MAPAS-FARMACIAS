import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Marker1 } from '../../constants/MarkerData'; // Asegúrate de importar correctamente Marker1

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface SlidingPanelProps {
  visible: boolean;
  marker: Marker1 | null;
  onClose: () => void;  // onClose se usa para cerrar el panel
}

const SlidingPanel: React.FC<SlidingPanelProps> = ({ visible, marker, onClose }) => {
  const panelPosition = useRef(new Animated.Value(SCREEN_HEIGHT)).current; // El panel comienza fuera de la pantalla
  let panOffsetY = 0; // Usaremos esto para almacenar el desplazamiento actual

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;  // Solo habilitar si el usuario ha desplazado más de 10 píxeles
      },
      onPanResponderGrant: () => {
        // Registrar la posición inicial cuando el usuario comienza a mover
        panelPosition.stopAnimation((value) => {
          panOffsetY = value; // Guardar la posición actual como offset de inicio
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        // Calcular la nueva posición del panel en función del movimiento y el offset
        const newY = panOffsetY + gestureState.dy;
        panelPosition.setValue(newY); // Ajustar la posición en tiempo real
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          // Si el usuario arrastra más de 50 píxeles hacia abajo, baja el panel completamente
          Animated.spring(panelPosition, {
            toValue: SCREEN_HEIGHT, // Baja el panel fuera de la pantalla
            useNativeDriver: false,
          }).start(() => onClose()); // Cerrar el panel cuando la animación termine
        } else {
          // Si el usuario arrastra hacia arriba o poco hacia abajo, vuelve a la mitad
          Animated.spring(panelPosition, {
            toValue: SCREEN_HEIGHT / 2, // Regresar el panel a la mitad de la pantalla
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Si `visible` es true y hay un `marker`, abrir el panel a la mitad de la pantalla
  if (visible && marker) {
    Animated.spring(panelPosition, {
      toValue: SCREEN_HEIGHT / 2,
      useNativeDriver: false,
    }).start();
  }

  // Si no hay un marker seleccionado, mantener el panel fuera de la pantalla
  if (!marker) {
    Animated.spring(panelPosition, {
      toValue: SCREEN_HEIGHT,  // Mover el panel fuera de la vista
      useNativeDriver: false,
    }).start();
    return null; // No renderizar el panel si no hay un marker
  }

  return (
    <Animated.View
      style={[styles.panelContainer, { transform: [{ translateY: panelPosition }] }]}
      {...panResponder.panHandlers}
    >
      {/* El handle que el usuario puede arrastrar */}
      <View style={styles.handle} />
      
      {/* El contenido del panel */}
      <View style={styles.panel}>
        {marker && (
          <>
            <Text style={styles.title}>{marker.name}</Text>
            <Text>Dirección: {marker.direccion || 'No disponible'}</Text>
            <Text>Sector: {marker.sector || 'No disponible'}</Text>
            <Text>Tipo: {marker.tipo || 'No disponible'}</Text>
            <Text>Zona: {marker.zona || 'No disponible'}</Text>
            <Text>Número de Referencia: {marker.numeroReferencia || 'No disponible'}</Text>
            <Text>Medicamentos Regulados: {marker.medicamentosControlados || 'No disponible'}</Text>
            <Text>Horas de operación: {marker.horas || 'No disponible'}</Text>
          </>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    position: 'absolute',
    width: '100%',
    height: SCREEN_HEIGHT,
    top: 0,
    backgroundColor: 'white',  // Asegúrate de que el fondo sea blanco
    borderTopLeftRadius: 16,  // Para redondear las esquinas del panel
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  panel: {
    backgroundColor: '#fff',
    padding: 16,
    height: '100%',
  },
  handle: {
    width: 60,
    height: 6,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 10,
  },
});

export default SlidingPanel;
