// este archivo define la navegación principal de la app, con pestañas en la parte inferior.

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // crea el menu de la pestaña abajo
import { Ionicons } from '@expo/vector-icons';  // será usado para los íconos de las pestañas
import ClasesStack from './ClasesStack';
import ReservasScreen from '../screens/ReservasScreen'; //pendiente: crear pantalla de reservas
import PerfilScreen from '../screens/PerfilScreen'; // pendiente: crear pantalla de perfil
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

// Ícono de cada pestaña: [seleccionada, no seleccionada]
const TAB_ICONS = {
  Inicio: ['home', 'home-outline'],
  MisReservas: ['calendar', 'calendar-outline'],
  Perfil: ['person', 'person-outline'],
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primario,      // color del ícono y texto de la pestaña seleccionada
        tabBarInactiveTintColor: colors.textoSuave,    // color del ícono y texto de la pestaña no seleccionada
        tabBarIcon: ({ focused, color, size }) => {
          const [activeIcon, inactiveIcon] = TAB_ICONS[route.name];
          return <Ionicons name={focused ? activeIcon : inactiveIcon} size={size} color={color} />;
        },
      })}
    >
      {/* Inicio: lista de clases -> detalle -> reservar */}
      <Tab.Screen
        name="Inicio"
        component={ClasesStack}
        options={{ headerShown: false }}
      />
      {/* Mis reservas: reservas guardadas en el celular */}
      <Tab.Screen
        name="MisReservas"
        component={ReservasScreen}
        options={{ title: 'Mis reservas' }}
      />
      {/* Perfil: registro y consulta del estudiante */}
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}