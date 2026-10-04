import React, { createContext, useContext, useState } from 'react';
import { clases as CLASES_INICIALES } from '../data/clases';

const ClasesContext = createContext(null);

export function ClasesProvider({ children }) {
  const [clases, setClases] = useState(CLASES_INICIALES);
  // Map: id de la clase -> { dia, hora } de la reserva
  const [reservadas, setReservadas] = useState(new Map());

  function reservarClase(id, horario) {
    const clase = clases.find((c) => c.id === id);
    if (!clase) return false;
    if (clase.cupos <= 0) return false;
    if (reservadas.has(id)) return false; // ya está reservada: no descontar otro cupo

    setClases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, cupos: c.cupos - 1 } : c))
    );
    setReservadas((prev) => new Map(prev).set(id, horario));
    return true;
  }

  function cancelarClase(id) {
    if (!reservadas.has(id)) return false; // no hay reserva: no devolver cupo

    setClases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, cupos: c.cupos + 1 } : c))
    );
    setReservadas((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    return true;
  }

  return (
    <ClasesContext.Provider value={{ clases, reservarClase, cancelarClase, reservadas }}>
      {children}
    </ClasesContext.Provider>
  );
}

export function useClases() {
  const ctx = useContext(ClasesContext);
  if (!ctx) throw new Error('useClases must be used within ClasesProvider');
  return ctx;
}

export default ClasesContext;