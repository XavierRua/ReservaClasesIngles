import { useContext } from 'react';
import { ReservasContext } from '../context/ReservasContext';

// Encapsulamiento para el acceso al contexto de reservas
export default function useReserva() {
  const context = useContext(ReservasContext);

  if (!context) {
    throw new Error('useReserva debe usarse dentro de ReservationProvider');
  }

  return context;
}