import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainTabs from './src/navigation/MainTabs';
import { ClasesProvider } from './src/context/ClasesContext';
import { ReservationProvider } from './src/context/ReservasContext';
import { colors } from './src/theme/index';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.fondo,
    card: colors.superficie,
    primary: colors.primario,
    text: colors.texto,
    border: colors.borde,
  },
};

export default function App() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <SafeAreaProvider>
        <ReservationProvider>
          <ClasesProvider>
            <MainTabs />
          </ClasesProvider>
          <StatusBar style="auto" />
        </ReservationProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}