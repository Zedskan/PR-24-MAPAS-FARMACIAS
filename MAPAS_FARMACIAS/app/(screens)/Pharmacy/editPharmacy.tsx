import React, { useCallback, useState, useRef } from 'react';
import { View, StyleSheet, Button, Text, ScrollView, Alert, TouchableOpacity, Modal } from 'react-native';
import { TextInput, Snackbar } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker'; // Importar Picker
import { apiFetch } from '../../(ApiRes)/apiConfig.js';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';


type FormData = {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  phone: string;
  codeZona: string;
  sectorName: string;
  typePharmacy: string;
  zonaName: string;
  healthNetwork: string;
  townName: string;
  userName: string;
  personName: string;
  personLastName: string;
};


type PharmacyParams = {
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
  };

const INITIAL_REGION = {
  latitude: -17.3895,
  longitude: -66.1568,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};



type User = {
    id: string; 
    name: string; 
}
type RedSalud = {
    id: string;
    name: string;
}
type Zona = {
    id: string;
    name: string;
}
type TypePharmacy = {
    id: string;
    name: string;
}
type Sector = {
    id: string;
    name: string;
}

interface EditUserProps {
    pharmacy: PharmacyParams; // Asegúrate de recibir los datos del usuario a editar
}

type MarkerPosition = {
    latitude: number;
    longitude: number;
};
  

const PharmacyEditPharmacy: React.FC = () => {
  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [userData, setDataUser] = useState<User[]>([]);
  const [redSaludData, setDateredSalud] = useState<RedSalud[]>([]);
  const [zonaData, setDatezona] = useState<Zona[]>([]);
  const [typePharmacyData, setDatetypePharmacy] = useState<TypePharmacy[]>([]);
  const [sectorData, setDataSector] = useState<Sector[]>([]);

 
  const { id } = useLocalSearchParams();

  const [latitude, setLatitude] = useState(INITIAL_REGION.latitude);
  const [longitude, setLongitude] = useState(INITIAL_REGION.longitude);
  const [markerPosition, setMarkerPosition] = useState<MarkerPosition>();
  const [modalVisible, setModalVisible] = useState(false);

  const handleMapPress = async (event: { nativeEvent: { coordinate: { latitude: any; longitude: any; }; }; }) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLatitude(latitude);
    setLongitude(longitude);
    setMarkerPosition({ latitude, longitude });
  };



  const onSubmit = async (data: FormData) => {
    
    try {
        const formattedData = {
            id: id,
            name: data.name,
            address: data.address,
            latitude: String(latitude),
            longitude: String(longitude),
            phone: data.phone,
            codeZona: data.codeZona,
            idSector: Number(data.sectorName),
            idTypePharmacy: Number(data.typePharmacy),
            idZona: Number(data.zonaName),
            idHealthNetwork: Number(data.healthNetwork),
            idUser: Number(data.userName),
        };

        console.log(formattedData)

          const response = await apiFetch("/updatePharmacy", {
              method: "PUT",
              body: JSON.stringify(formattedData),
          });

         if (response) { 
              router.back();
              Alert.alert('Actualizacion exitoso de Farmacia', );
              console.log("Farmacia Uctualizado con éxito:",response.message );
              setSnackbarVisible(true); // Show success Snackbar
          }
      
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
};




  const getUsers = async () => {
    try {
      const data  = await apiFetch("/getPropietarios", {
        method: "GET",
      });

      if (data) {
        
        setDataUser(data);
      } else {
        console.log("No se encontró ningún Propietario.");
      }
    } catch (error) {
      console.error("Error al recuperar los datos del Propietarios:", error);
    }
  };
  const getRedSalud = async () => {
    try {
      const data  = await apiFetch("/getRedSalud", {
        method: "GET",
      });
      if (data) {
       
        setDateredSalud(data);
      } else {
        console.log("No se encontró ningúna ciudad.");
      }
    } catch (error) {
      console.error("Error al recuperar los Redes de Salud:", error);
    }
  };
  const getZona = async () => {
    try {
      const data  = await apiFetch("/getZona", {
        method: "GET",
      });
      if (data) {
        
        setDatezona(data);
      } else {
        console.log("No se encontró ningúna zona.");
      }
    } catch (error) {
      console.error("Error al recuperar los datos de la zona:", error);
    }
  };
  const getTypePharmacy = async () => {
    try {
      const data  = await apiFetch("/getTypeFarmacy", {
        method: "GET",
      });
      if (data) {
        
        setDatetypePharmacy(data);
      } else {
        console.log("No se encontró ningúna zona.");
      }
    } catch (error) {
      console.error("Error al recuperar los datos de la zona:", error);
    }
  };
  const getSector = async () => {
    try {
      const data  = await apiFetch("/getSector", {
        method: "GET",
      });
      if (data) {
        
        setDataSector(data);
      } else {
        console.log("No se encontró ningúna Secto.");
      }
    } catch (error) {
      console.error("Error al recuperar los datos de la Sector:", error);
    }
  };


 

  const getPharmacyDetails = async () => {
    try {
        console.log(id)
        const response = await apiFetch(`/getFarmaciasById/${id}`, {
            method: 'POST',
          });
         setValue('name', response[0].name);
         setValue('address', response[0].address);
         setValue('phone', response[0].phone);
         setValue('codeZona', response[0].codeZona);
         setMarkerPosition({
             longitude: Number(response[0].longitude),
             latitude: Number(response[0].latitude),   // Asegúrate de convertirlo a número si es necesario     
         })
         setValue('sectorName', response[0].idSector);
         setValue('typePharmacy', response[0].idTypePharmacy);
         setValue('zonaName', response[0].idZona);
         setValue('healthNetwork', response[0].idHealthNetwork);
         setValue('userName', response[0].idUser);
    } catch (error) {
      console.error('Error al cargar los datos de la farmacia:', error);
    }
  };


  useFocusEffect(
    useCallback(() => {
      getUsers()
      getRedSalud()
      getZona()
      getTypePharmacy()
      getSector()
    
      getPharmacyDetails()

    }, [])
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>Registro de Farmacia</Text>
      <ScrollView>

        <Controller
          control={control}
          name="name"
          rules={{ required: 'El nombre es requerido.' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Nombre de la Farmacia"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              error={!!errors.name}
            />
          )}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

        <Controller
          control={control}
          name="address"
          rules={{ required: 'La dirección es requerida.' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Dirección"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              error={!!errors.address}
            />
          )}
        />
        {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}

       
          <View>
            <TouchableOpacity onPress={() =>  setModalVisible(true)}>
              <Text>
                Agregar cordenadas
              </Text>
            </TouchableOpacity>
          </View>

        <Controller
          control={control}
          name="phone"
          rules={{ required: 'El teléfono es requerido.' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Teléfono"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              keyboardType="phone-pad"
              error={!!errors.phone}
            />
          )}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

        <Controller
          control={control}
          name="codeZona"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Código de Zona"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
        />



        <Controller
        control={control}
        name="sectorName"
        //defaultValue= {5} // Set default value from pharmacy
        rules={{ required: 'Seleccione un sector' }} 
        render={({ field: { onChange, onBlur, value } }) => (
            <Picker    
                selectedValue={value}
                onValueChange={(itemValue) => {
                    console.log("mis da",itemValue)
                    onChange(itemValue);
                }}
                onBlur={onBlur}
                style={styles.input}
                >
                <Picker.Item label="Seleccione el sector" value="" /> 
                {sectorData.map((sector) => (
                    <Picker.Item key={sector.id} label={sector.name} value={sector.id} /> 
                ))}
            </Picker>
        )}
        />
        {errors.sectorName && <Text style={styles.errorText}>{errors.sectorName.message}</Text>}




        <Controller
        control={control}
        name="typePharmacy"
        defaultValue="" // Valor por defecto
        rules={{ required: 'Seleccione una tipo de Farmacia' }} // Reglas de validación
        render={({ field: { onChange, onBlur, value } }) => (
            <Picker
            selectedValue={value}
            onValueChange={(itemValue) => onChange(itemValue)} // Actualiza el valor en el estado del formulario
            onBlur={onBlur} // Marca el campo como "tocado" al perder el foco
            style={styles.input}
            >
            <Picker.Item label="Seleccione tipo de farmacia" value="" /> 
            {typePharmacyData.map((type) => (
                <Picker.Item key={type.id} label={type.name} value={type.id} /> // Asegúrate de que 'town.name' y 'town.id' sean correctos
            ))}
            </Picker>
        )}
        />
        {errors.typePharmacy && <Text style={styles.errorText}>{errors.typePharmacy.message}</Text>}






        <Controller
        control={control}
        name="zonaName"
        defaultValue="" // Valor por defecto
        rules={{ required: 'Seleccione una zona' }} // Reglas de validación
        render={({ field: { onChange, onBlur, value } }) => (
            <Picker
            selectedValue={value}
            onValueChange={(itemValue) => onChange(itemValue)} // Actualiza el valor en el estado del formulario
            onBlur={onBlur} // Marca el campo como "tocado" al perder el foco
            style={styles.input}
            >
            <Picker.Item label="Seleccione una zona" value="" /> 
            {zonaData.map((zona) => (
                <Picker.Item key={zona.id} label={zona.name} value={zona.id} /> // Asegúrate de que 'town.name' y 'town.id' sean correctos
            ))}
            </Picker>
        )}
        />
        {errors.zonaName && <Text style={styles.errorText}>{errors.zonaName.message}</Text>}




        <Controller
        control={control}
        name="healthNetwork"
        defaultValue="" // Valor por defecto
        rules={{ required: 'Seleccione una Reded de Salud' }} // Reglas de validación
        render={({ field: { onChange, onBlur, value } }) => (
            <Picker
            selectedValue={value}
            onValueChange={(itemValue) => onChange(itemValue)} // Actualiza el valor en el estado del formulario
            onBlur={onBlur} // Marca el campo como "tocado" al perder el foco
            style={styles.input}
            >
            <Picker.Item label="Seleccione una Reded de Salud" value="" /> 
            {redSaludData.map((rSalud) => (
                <Picker.Item key={rSalud.id} label={rSalud.name} value={rSalud.id} /> // Asegúrate de que 'town.name' y 'town.id' sean correctos
            ))}
            </Picker>
        )}
        />
        {errors.healthNetwork && <Text style={styles.errorText}>{errors.healthNetwork.message}</Text>}
       

        <Controller
          control={control}
          name="userName"
          defaultValue="" // Valor por defecto
          rules={{ required: 'Seleccione un Propietario' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Picker
              selectedValue={value}
              onValueChange={(itemValue) => onChange(itemValue)}
              onBlur={onBlur}
              style={styles.input}
            >
              <Picker.Item label="Seleccione un propietario" value="" />
              {userData.map((user) => (
                <Picker.Item key={user.id} label={user.name} value={user.id} /> // Asegúrate de que 'user.name' y 'user.id' sean correctos
              ))}
            </Picker>
          )}
        />
        {errors.userName && <Text style={styles.errorText}>{errors.userName.message}</Text>}




        <Button title="Actualizar" onPress={handleSubmit(onSubmit)} />
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
        >
          Farmacia registrada con éxito!
        </Snackbar>


      
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Seleccione el Lugar</Text>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={INITIAL_REGION}
              onPress={handleMapPress}
            >
              {markerPosition && <Marker coordinate={markerPosition} />}
            </MapView>
            <Text>{latitude}</Text>
            <Text>{longitude}</Text>
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
  },
  modalContainer: {
    width: 350,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
  map: {
    width: '100%',
    height: 350,
    marginBottom: 16,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default PharmacyEditPharmacy;
