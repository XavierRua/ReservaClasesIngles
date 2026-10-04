import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave de la "cajita" donde se guardan las reservas en el celular
const CLAVE_RESERVAS = '@reservas_ingles';

export const ReservasContext = createContext(null);

export function ReservaProvider({ children }) {
  const [reservas, setReservas] = useState([]); // se pueden reservar varias clases
  const [cargando, setCargando] = useState(true); // bandera de carga

  // Cargar las reservas guardadas. Si no hay nada, queda el arreglo vacío
  useEffect(() => {
    const cargar = async () => {
      try {
        const guardado = await AsyncStorage.getItem(CLAVE_RESERVAS);
        if (guardado !== null) {
          setReservas(JSON.parse(guardado)); // get -> parse
        }
      } catch (error) {
        console.log('Error leyendo las reservas:', error);
      } finally {
            setCargando(false);
      }
    };

    cargar();
  }, []);

  
}