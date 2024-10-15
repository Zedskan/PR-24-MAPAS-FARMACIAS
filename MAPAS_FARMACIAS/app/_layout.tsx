import React from 'react';
import { Drawer } from 'expo-router/drawer';

const Layout = () => (
  <Drawer>
    <Drawer.Screen
      name="index"
      options={{ title: 'Home' }} 
    />
    <Drawer.Screen
      name="registro"
      options={{ title: 'Registro' }} 
    />
    <Drawer.Screen
      name="login"
      options={{ title: 'Iniciar sesión' }} 
    />
  </Drawer>
);

export default Layout;
