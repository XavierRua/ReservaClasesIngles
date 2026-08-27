import React from 'react';
import { View, Text, Image, Pressable ,StyleSheet } from "react-native";
// Importa componente de EtiquetaNivel.js
import EtiquetaNivel from "./EtiquetaNivel";
import { colors, radius, spacing,typography } from "../theme";
import { CLASES, formatearPrecio } from "../data/clases";



/* ({urlImagen , onpress, ancho}) lo que esta en {} se llama comoponete Aquí recibe una prop. 
"Recibe un objeto y extrae de él el urlImagen , onpress, ancho    . == urlImagen , onpress, ancho son propiedades que se extraen de 
un objeto recibido como parámetrO== "Del objeto que recibo, quiero extraer estas propiedades
*/

export default function Card({clase, onPress}){
  return(
    <Pressable
      onPress={onPress}
    >
      <Image source={{uri: clase.image}}/>
      <View>
        <EtiquetaNivel nivel={clase.nivel}/>
      </View>
      <Text style={style.titulo} numberOfLines={2}>{clase.titulo}</Text>
      -nombre profesor
      -horario
      -precio
    </Pressable>
  )
}


const style = StyleSheet.create({
  tarjeta: {
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  imagen: {
    width: '100%',
    height: 130,
    backgroundColor: colors.primarioSuave,
  },
  cuerpo: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  titulo: { fontSize: 16, fontWeight: '700', color: colors.texto },
  filaProfesor: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.borde },
  profesor: { fontSize: 13, color: colors.textoSuave, flexShrink: 1 },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  filaCentro: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { fontSize: 12, color: colors.textoSuave },
  punto: { color: colors.borde, marginHorizontal: 2 },
  precio: { fontSize: 14, fontWeight: '800', color: colors.primario },
})





// la etique image su forma es:           <Image source={{ uri: url }} />
/* la etiqueta pressable Es un componente que se puede tocar o presionar su forma es :    <Pressable onPress={() => alert("Hola")}>
                                                                                             <Text>Presióname</Text>
                                                                                           </Pressable>
*/  
//