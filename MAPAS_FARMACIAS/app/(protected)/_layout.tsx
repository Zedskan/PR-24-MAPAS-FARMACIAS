// app/_layout.tsx
import React from 'react';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Role, useAuth } from '../../context/AuthContext';
import UserProfileHeader from '../components/userProfile'
export default function Layout() {

  const { authState} = useAuth()



  return (
    <GestureHandlerRootView style={{flex:1}}>
      <Drawer
        drawerContent={UserProfileHeader}>

        <Drawer.Screen
            name = "index"
            options={{
                headerTitle: 'Home',
                drawerLabel: 'Home',
                drawerIcon: ({size, color}) => (
                    <Ionicons name="home-outline" size={size} color={color} />
                )
            }}>
        </Drawer.Screen>


        <Drawer.Screen
            name = "Usuarios"
            redirect = {authState?.role !== Role.ADMIN}
            options={{
                headerTitle: 'Propiestarios de Farmacias',
                drawerLabel: 'Usuarios',
                drawerIcon: ({size, color}) => (
                  <FontAwesome5 name="users" size={size} color={color} />
                ),
            }}>
        </Drawer.Screen>

        <Drawer.Screen
            name = "Pharmacy"
            redirect = {authState?.role !== Role.ADMIN}
            options={{
                headerTitle: 'Farmacias',
                drawerLabel: 'Farmacias',
                drawerIcon: ({size, color}) => (
                  <MaterialIcons name="local-pharmacy" size={size} color={color} />
                ),
            }}>
        </Drawer.Screen>


        <Drawer.Screen
            name = "Branches"
            redirect = {authState?.role !== Role.USER}
            options={{
                headerTitle: 'Mis Sucursales',
                drawerLabel: 'Mis Sucursales',
                drawerIcon: ({size, color}) => (
                  <FontAwesome5 name="users" size={size} color={color} />
                ),
            }}>
        </Drawer.Screen>


      </Drawer>
   
      </GestureHandlerRootView>
  );
}
