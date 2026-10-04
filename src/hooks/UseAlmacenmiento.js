import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hook de persistencia de datos local (guarda en el celular)
// Recibe una clave y un valor inicial (formato clave - valor)


export default function useAlmacenamiento(clave, valorInicial) {
  const [valor, setValor] = useState(valorInicial);
  const [listo, setListo] = useState(false);

  // Lee la información guardada cuando el componente se monta o cambia la clave
  useEffect(() => {
    let activo = true; // bandera: ¿el componente sigue montado?

    AsyncStorage.getItem(clave)
      .then((guardado) => {
        if (activo && guardado !== null) setValor(JSON.parse(guardado)); // get -> parse
      })
      .catch((error) => console.log('Error leyendo' + clave, error))
      .finally(() => activo && setListo(true)); // marca que ya terminó de leer{

      return () => {
      activo = false;
      }
    

    // Función de limpieza
    
    }, [clave]);

  // Actualiza el valor y lo guarda en el celular
  const actualizar = useCallback(
    async (nuevoValor) => {
        setValor(nuevoValor);
        try {
            await AsyncStorage.setItem(clave, JSON.stringify(nuevoValor)); // set -> stringify
        }catch (error) {
            console.log('Error guardando' + clave, error);
      }
    },
    [clave]
  );

  return { valor, actualizar, listo };
}