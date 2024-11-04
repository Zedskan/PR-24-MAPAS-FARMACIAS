// app/components/UserProfileHeader.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const userImg = require('../../assets/images/user.jpg')


type User = {
    userName: string;
    email: string;
    role: string;
    name: string;
    lastName: string
  };


export default function UserProfileHeader (props: any) {

    const { onLogout } = useAuth();
    const {top, bottom} = useSafeAreaInsets()
    const [user, setUser] = useState<User | null>(null);



    const onLogoutPressed = () => {
      onLogout!()
    }

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const storedUser = await AsyncStorage.getItem('user'); // Recupera los datos del usuario desde AsyncStorage
            if (storedUser) {
              setUser(JSON.parse(storedUser)); // Si hay datos, actualiza el estado del usuario
              console.log("Datos del usuario recuperados:", storedUser);
            } else {
              console.log("No se encontró ningún usuario en AsyncStorage.");
            }
          } catch (error) {
            console.error("Error al recuperar los datos del usuario:", error);
          }
        };
    
        fetchUserData();
      }, []);

      


  return (
    <View style={{flex:1}}>
     <DrawerContentScrollView 
       {...props}
       scrollEnabled={false}
       contentContainerStyle = {{backgroundColor:"white", paddingTop: top}}>
        <View style={styles.headerContainer}>
            <Image style={styles.profileImage} source={userImg}/>
            <View style={{ alignItems: 'center',}}>
                <Text style={styles.userName}>{user ? user?.name : ""} {user ? user?.lastName : ""}</Text>
                <Text style={styles.userEmail}>{user ? user.email : ""}</Text>
            </View>
            <View>
                <Text>{user? user.role : ""}</Text>
            </View>
        </View>
        <DrawerItemList {...props}/>
    </DrawerContentScrollView>

    <View style={{borderTopColor:'#dde3fe', borderTopWidth:1, padding:20,paddingBottom:20+bottom}}>
        <TouchableOpacity onPress={onLogoutPressed} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="logout" size={20} color="black" style={{ marginRight: 5 }} />
            <Text style={{ fontSize: 16 }}>Cerrar sesión</Text>
        </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#CBDCEB',
    borderBottomRightRadius:30
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: 'gray',
  },
});

