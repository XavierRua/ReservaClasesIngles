import { useContext } from 'react';
import { ReservasContext } from '../context/ReservasContext';
 
// Encapsulamiento para el acceso al contexto de reservas
export default function useReserva() {
  const contexto = useContext(ReservasContext);
 
  if (!contexto) {
    throw new Error('useReserva debe usarse dentro de ReservaProvider');
  }
 
  return contexto;
}