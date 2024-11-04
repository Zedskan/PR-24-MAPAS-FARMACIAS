import React, { useState, useRef, useMemo, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { apiFetch } from '../(ApiRes)/apiConfig';
import PharmacyCar from '../components/PharmacyCard';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DeleteConfirmationModal from '../(screens)/Pharmacy/deletePharmacy'
type Pharmacy = {
    id: number;
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    phone: string;
    codeZona: string;
    status: number;
    sectorName: string;
    typePharmacy: string;
    zonaName: string;
    healthNetwork: string;
    townName: string;
    userName: string;
    personName: string;
    personLastName: string;
    profilePicture?: string; 
  };

const Usuarios: React.FC = () => {
  const router = useRouter();
  const [dataPharmacy, setDataPharmacy] = useState<Pharmacy[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  //modal para eliminar
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const handleDelete = async () => {
    try {
     
      const response = await apiFetch(`/deletePharmacy/${selectedPharmacy?.id}`, {
        method: "DELETE",
      });
      console.log(response)
      if (response) {
        console.log("Elemento eliminado exitosamente.");
        closeBottomSheet()
        getFarmacy()
        alert("Farmacia eliminada correctamente.");
      }
    } catch (error) {
      // Manejo de errores de red u otros errores inesperados
      console.error("Error en la solicitud de eliminación:", error);
      alert("Hubo un problema al eliminar la farmacia. Intente de nuevo.");
    } finally {
      // Cierra el modal independientemente del resultado
      setModalVisible(false);
    }
  };
  
  const handleCancel = () => {
    setModalVisible(false);
  };





  // Snap points del bottom sheet
  const snapPoints = useMemo(() => ['1%','30%', '50%'], []);
  const openBottomSheet = (phar: Pharmacy) => {
    setSelectedPharmacy(phar);
    console.log("dataadasd:",phar)
    bottomSheetRef.current?.expand(); // Abre el bottom sheet
  };
  const closeBottomSheet = () => {
    //setSelectedUser(null);
    bottomSheetRef.current?.close();
  };




  ///para recuperar las farmacias
  const getFarmacy = async () => {
    try {
      const data  = await apiFetch("/getFarmacy", {
        method: "GET",
      });

      if (data) {
        console.log( data);
        setDataPharmacy(data);
      } else {
        console.log("No se encontró ningúna Farmacia.");
      }

    } catch (error) {
      console.error("Error al recuperar los datos:", error);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
        getFarmacy();
    }, [])
  );


  const handleEditPharmacy = () => {
    closeBottomSheet()
    router.push({
      pathname: "/(screens)/Pharmacy/editPharmacy",
      params: { id: selectedPharmacy?.id },
    });
  };




  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={{ flex: 1 }}>

      <View style={styles.header}>
        <Text style={styles.headerText}>Farmacias</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(screens)/Pharmacy/createpharmacy')}>
           <MaterialIcons name="local-pharmacy" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {dataPharmacy.map((Pharmacy) => (
          <PharmacyCar key={Pharmacy.id} pharmacy={Pharmacy} onPress={openBottomSheet} /> // Pasa la función onPress
        ))}
      </ScrollView>

      {/* Bottom Sheet */}
      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints} onClose={closeBottomSheet} enablePanDownToClose={true}>
  <BottomSheetView style={styles.sheetContent}>
    {selectedPharmacy && (
      <>
        <Text style={styles.pharmacyName}>{selectedPharmacy.name}</Text>
        <Text style={styles.pharmacyAddress} numberOfLines={1}>{selectedPharmacy.address}</Text>
        <Text style={styles.pharmacyPhone}>
            <MaterialIcons name="phone" size={16} color="#4A90E2" />
            {selectedPharmacy.phone}
        </Text>

        <View style={styles.infoContainer}>
          <MaterialIcons name="location-city" size={16} color="#4A90E2" />
          <Text style={styles.additionalInfo}>{selectedPharmacy.townName}</Text>
        </View>
        <View style={styles.infoContainer}>
          <MaterialIcons name="business" size={16} color="#4A90E2" />
          <Text style={styles.additionalInfo}>Sector: {selectedPharmacy.sectorName}</Text>
        </View>
        <View style={styles.infoContainer}>
          <MaterialIcons name="local-pharmacy" size={16} color="#4A90E2" />
          <Text style={styles.additionalInfo}>Tipo: {selectedPharmacy.typePharmacy}</Text>
        </View>
        <View style={styles.infoContainer}>
          <MaterialIcons name="place" size={16} color="#4A90E2" />
          <Text style={styles.additionalInfo}>Zona: {selectedPharmacy.zonaName}</Text>
        </View>
        <View style={styles.infoContainer}>
          <MaterialIcons name="health-and-safety" size={16} color="#4A90E2" />
          <Text style={styles.additionalInfo}>Red de Salud: {selectedPharmacy.healthNetwork}</Text>
        </View>
        <Text style={styles.additionalInfo}>
          Persona Responsable: {selectedPharmacy.personName} {selectedPharmacy.personLastName}
        </Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity onPress={handleEditPharmacy} style={styles.buttonContainer}>
            <MaterialIcons name="edit" size={24} color="#fff" />
            <Text style={styles.buttonText}>Editar Farmacia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainerDelete} onPress={() => setModalVisible(true)}>
            <MaterialIcons name="delete" size={24} color="white" />
            <Text style={styles.buttonText}>Eliminar Farmacia</Text>
          </TouchableOpacity>
        </View>
      </>
    )}
  </BottomSheetView>
</BottomSheet> 
    </View>

    <DeleteConfirmationModal
        visible={modalVisible}
        onDelete={handleDelete}
        onCancel={handleCancel}
      />

    </GestureHandlerRootView>
  );
};

export default Usuarios;

const styles = StyleSheet.create({

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
      },
      headerText: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      button: {
        backgroundColor: '#4A90E2',
        borderRadius: 50,
        padding: 15,
      },
      //--------------------------------------------------------
    sheetContent: {
        padding: 16,
        backgroundColor: '#F9F9F9', // Color de fondo más claro
      },
      pharmacyName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
      },
      pharmacyAddress: {
        fontSize: 16,
        color: '#555',
        marginBottom: 8,
      },
      pharmacyPhone: {
        fontSize: 16,
        color: '#555',
        marginBottom: 16,
      },
      infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0', // Línea divisoria
      },
      additionalInfo: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
      },
      buttonGroup: {
        marginTop: 20,
      },
      buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4A90E2',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
      },
      buttonContainerDelete: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
        fontWeight: '600',
      },
});