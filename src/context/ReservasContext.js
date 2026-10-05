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

    // hacer el guardado de las reservas cada vez que cambian (y ya terminó de cargar)
   useEffect(() => {
    // Si todavía está cargando, no guarda (evita sobrescribir y que la pantalla titile)
    if (cargando) return;
    AsyncStorage.setItem(CLAVE_RESERVAS, JSON.stringify(reservas)) // set -> stringify
      .catch((error) => 
        console.log('Error al guardar reservas:', error)
      );
  }, [reservas, cargando]);
 
  // 3. Agregar una reserva: necesita la clase y el horario
  const agregarReserva = useCallback((clase, horario) => {
    const nueva = {
      id: clase.id + '-' + horario, // id único: id de la clase + horario
      titulo: clase.titulo,
      nivel: clase.nivel,
      profesor: clase.profesor.nombre,
      precio: clase.precio,
      horario: horario,
      creadoEn: new Date().toISOString(), // fecha en que se hizo la reserva
    };
 
    let resultado = { ok: true };
 
    setReservas((previas) => {
      // Si ya existe una reserva con ese mismo id, no la repite
      if (previas.some((r) => r.id === nueva.id)) {
        return previas;
      }
      // Si no existe, trae las previas y le pega la nueva (no borra nada)
      return [nueva, ...previas];
    });
 
    return resultado;
  }, []);
 
  // 4. Lo que el contexto comparte con toda la app
  const valor = useMemo(
    () => ({  cargando, agregarReserva,reservas }),
    [cargando, agregarReserva,reservas]
  );
 
  return (
    <ReservasContext.Provider value={valor}>
      {children}
    </ReservasContext.Provider>
  );
 // fin de ReservaProvider

  
} // esta es la llave de cierre del componente ReservaProvider