import { useState, useEffect, useCallback } from 'react';
import { getData, saveData } from '../services/asyncStorage';

// Hook de persistencia de datos local (guarda en el celular)
// Recibe una llave y un valor inicial (formato llave - valor)
export default function useAlmacenamiento(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [ready, setReady] = useState(false);

  // Lee la información guardada cuando el componente se monta o cambia la llave
  useEffect(() => {
    let active = true; // bandera: ¿el componente sigue montado?

    getData(key)
      .then((stored) => {
        if (active && stored !== null) {
          setValue(stored); // getData ya hace el parse
        }
      })
      .finally(() => {
        if (active) {
          setReady(true);
        }
      });

    // Función de limpieza
    return () => {
      active = false;
    };
  }, [key]);

  // Actualiza la pantalla (renderiza la UI) y guarda en el celular (persistencia)
  const update = useCallback(
    async (newValue) => {
      setValue(newValue); // renderiza la UI
      await saveData(key, newValue); // persistencia de los datos
    },
    [key]
  );

  return { value, update, ready };
}