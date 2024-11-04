import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from '../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


const StackLayout = () => {
  const {authState } = useAuth();
  const segments = useSegments()
  const router = useRouter(); 


   useEffect(() => {
    const authentification = async () => {

      const inAuthGroup = segments[0] === '(protected)'
      console.info("Auth changed", authState, inAuthGroup)
      const storedUserString  = await AsyncStorage.getItem('user');
      const storedUser = storedUserString ? JSON.parse(storedUserString) : null;


      console.log("ultima informacion",storedUser?.firstLogin)
      if(!authState?.authenticated && inAuthGroup){
        router.replace('/login')
  
      }else if(authState?.authenticated === true){
        if(storedUser?.firstLogin == 1 ){
          router.replace('/firstLogin')
        }else{
          router.replace('/(protected)')
        }  
      }
    }
    authentification()
   },[authState])



  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
          title: 'Inicio',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('./login')}>
              <MaterialIcons name="login" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="login" />
      <Stack.Screen name="(protected)" options={{headerShown: false}}/>
      <Stack.Screen name="(screens)/Users/createUser" options={{ title: 'Registro de Usuario',}}/>
      <Stack.Screen name="(screens)/Pharmacy/createpharmacy" options={{ title: 'Registro de Farmacia',}}/>
    </Stack>
  );
};
//(screen)/Users/createUser
export default function RootLayout() {
  return (
    <AuthProvider style={{ flex: 1 }}>
      <StackLayout />
    </AuthProvider>
  );
}
