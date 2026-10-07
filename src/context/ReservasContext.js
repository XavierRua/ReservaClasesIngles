// carga,guarda y comparte las reservas que el usuario ha hecho, para mostrarlas en la pestaña Mis reservas

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getData, saveData } from '../services/asyncStorage';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const ReservasContext = createContext(null);

export function ReservationProvider({ children }) {
  const [reservations, setReservations] = useState([]); // se pueden reservar varias clases
  const [loading, setLoading] = useState(true); // bandera de carga

  // 1. Cargar las reservas guardadas. Si no hay nada, queda el arreglo vacío
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await getData(STORAGE_KEYS.RESERVATIONS); // ya viene con parse
        if (stored !== null) {
          setReservations(stored);
        }
      } catch (error) {
        console.log('Error leyendo las reservas:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // 2. Guardar las reservas cada vez que cambien
  useEffect(() => {
    // Si todavía está cargando, no guarda (evita sobrescribir)
    if (loading) return;

    saveData(STORAGE_KEYS.RESERVATIONS, reservations); // ya hace el stringify
  }, [reservations, loading]);

  // 3. Agregar una reserva: necesita la clase y el horario
  // (titulo, nivel, profesor y precio vienen así desde data/clases.js)
  const addReservation = useCallback((classItem, schedule) => {
    const newReservation = {
      id: `${classItem.id}-${schedule}`, // id único: id de la clase + horario
      classId: classItem.id, // para saber a qué clase pertenece la reserva
      title: classItem.titulo,
      level: classItem.nivel,
      teacher: classItem.profesor.nombre,
      price: classItem.precio,
      modality: classItem.modalidad,
      duration: classItem.duracion,
      schedule: schedule,
      createdAt: new Date().toISOString(), // fecha en que se hizo la reserva
    };

    let result = { ok: true };

    setReservations((previous) => {
      // Si ya existe una reserva con ese mismo id, no la repite
      if (previous.some((r) => r.id === newReservation.id)) {
        result = { ok: false };
        return previous;
      }
      // Si no existe, trae las previas y le pega la nueva (no borra nada)
      return [...previous, newReservation];
    });

    return result;
  }, []);

  // 4. Cupos disponibles = cupos de la clase - reservas guardadas de esa clase
  // Así los cupos no se reinician al cerrar la app
  const getAvailableSeats = useCallback(
    (classItem) => {
      const reserved = reservations.filter((r) => r.classId === classItem.id).length;
      return Math.max(classItem.cupos - reserved, 0);
    },
    [reservations]
  );

  // 5. Lo que el contexto comparte con toda la app
  const value = useMemo(
    () => ({ reservations, loading, addReservation, getAvailableSeats }),
    [reservations, loading, addReservation, getAvailableSeats]
  );

  return (
    <ReservasContext.Provider value={value}>
      {children}
    </ReservasContext.Provider>
  );
} // fin de ReservationProvider