import React, { useState, useRef, useMemo, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { apiFetch } from '../(ApiRes)/apiConfig';
import UserCard from '../components/UserCard';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DeleteConfirmationModal from '../(screens)/Users/userDelete'
type User = {
  id: number;
  name: string;
  lastName: string;
  email: string;
  nit: string;
  numberPhone: string;
  role: string;
  status: number;
  userName: string;
  profilePicture?: string;
};

const Usuarios: React.FC = () => {
  const router = useRouter();
  const [dataUser, setDataUser] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Snap points del bottom sheet
  const snapPoints = useMemo(() => ['1%','30%', '50%'], []);
  const openBottomSheet = (user: User) => {
    setSelectedUser(user);
    console.log("dataadasd:",user)
    bottomSheetRef.current?.expand(); // Abre el bottom sheet
  };

  
  const closeBottomSheet = () => {
    //setSelectedUser(null);
    bottomSheetRef.current?.close();
  };
  const getUsers = async () => {
    try {
      const data: User[] = await apiFetch("/getPropietarios", {
        method: "GET",
      });

      if (data) {
        console.log(data);
        setDataUser(data);
      } else {
        console.log("No se encontró ningún Propietario.");
      }
    } catch (error) {
      console.error("Error al recuperar los datos del Propietarios:", error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getUsers();
    }, [])
  );
  const handleEditUser = () => {
    // Navega a 'editUser' pasando selectedUser como parámetro
    closeBottomSheet()
    router.push({
      pathname: "/Users/EditUser",
      params: { user: JSON.stringify(selectedUser) },
    });
  };


  const deleteUser = async (id: number) => {
    try {
      await apiFetch(`/deleteUser/${id}`, { method: "DELETE" });
      setDataUser((prevData) => prevData.filter((user) => user.id !== id));
      console.log(`Usuario con ID ${id} eliminado exitosamente.`);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };



  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const handleDelete = async () => {
    try {
     
      let response;
      let mensaje = ""

      if(selectedUser?.status === 1){
        response = await apiFetch(`/deleteUser/${selectedUser?.id}`, {
          method: "DELETE",
        });
        mensaje = "Usuario Deshabitado correctamente."
      }else{
        response = await apiFetch(`/avilitarUser/${selectedUser?.id}`, {
          method: "DELETE",
        });
          mensaje = "Usuario Habilitado correctamente."
      }
     
      
      
      console.log(response)
      if (response) {
        console.log("Elemento eliminado exitosamente.");
        closeBottomSheet()
        getUsers()
        alert(mensaje);
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



  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Dueño de Farmacia</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(screens)/Users/createUser')}>
          <MaterialIcons name="person-add" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {dataUser.map((user) => (
          <UserCard key={user.id} user={user} onPress={openBottomSheet} /> // Pasa la función onPress
        ))}
      </ScrollView>

      {/* Bottom Sheet */}
      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints}  onClose={closeBottomSheet} enablePanDownToClose={true}  >
          <BottomSheetView style={styles.sheetContent}>
            {selectedUser && (
              <>
                <Text style={styles.title}>{selectedUser.name} {selectedUser.lastName}</Text>
                
                <View style={styles.infoContainer}>
                  <MaterialIcons name="email" size={24} color="#4A90E2" />
                  <Text style={styles.infoText}>{selectedUser.email}</Text>
                </View>

                <View style={styles.infoContainer}>
                  <MaterialIcons name="account-circle" size={24} color="#4A90E2" />
                  <Text style={styles.infoText}>Usuario: {selectedUser.userName}</Text>
                </View>

                <View style={styles.infoContainer}>
                  <MaterialIcons name="business" size={24} color="#4A90E2" />
                  <Text style={styles.infoText}>NIT: {selectedUser.nit}</Text>
                </View>

                <View style={styles.infoContainer}>
                  <MaterialIcons name="phone" size={24} color="#4A90E2" />
                  <Text style={styles.infoText}>Teléfono: {selectedUser.numberPhone}</Text>
                </View>

                <View style={styles.infoContainer}>
                  <MaterialIcons name="badge" size={24} color="#4A90E2" />
                  <Text style={styles.infoText}>Rol: {selectedUser.role}</Text>
                </View>


                <View>
                  <TouchableOpacity onPress={handleEditUser} style={styles.buttonContainer}>
                    <MaterialIcons name="edit" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Editar Usuario</Text>
                  </TouchableOpacity>
                </View>

                <View>
                  <TouchableOpacity 
                    onPress={() => {
                      if (selectedUser) {
                        setModalVisible(true);
                      }
                      closeBottomSheet();
                    }} 
                    style={[
                      styles.buttonContainerDelete,
                      { backgroundColor: selectedUser?.status === 1 ? 'red' : 'gray' },
                    ]}
                  >
                    <MaterialIcons name="delete" size={24} color="white" />

                    <Text style={styles.buttonText}>{selectedUser.status === 1 ? 'Deshabitar': 'Habilitar'}</Text>
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
        status = {Number(selectedUser?.status)}
      />

    </GestureHandlerRootView>
  );
};

export default Usuarios;

const styles = StyleSheet.create({
  //--------------------
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2', // Fondo azul
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000', // Sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4, // Para sombra en Android
  },

  buttonContainerDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red', // Fondo azul
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000', // Sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4, // Para sombra en Android
  },
  buttonText: {
    color: '#fff', // Texto blanco
    fontSize: 16,
    marginLeft: 8, // Espacio entre icono y texto
    fontWeight: '600',
  },
  //-----------------
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
  sheetContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
});