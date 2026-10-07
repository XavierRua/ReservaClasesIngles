//decide qué pantalla se muestra primero dentro de la pestaña Inicio

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InicioScreen from '../screens/InicioScreen';
import DetalleClaseScreen from '../screens/DetalleClaseScreen';

const Stack = createNativeStackNavigator();

export default function ClasesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={InicioScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetalleClase"
        component={DetalleClaseScreen}
        options={{ title: 'Detalle', headerBackTitle: 'Atrás' }}
      />
    </Stack.Navigator>
  );
}