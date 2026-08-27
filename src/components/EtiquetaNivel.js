// importa la liberia de react
import React from "react";

// importa componentes de react native

import {View,Text,StyleSheet} from 'react-native';
import {color, spacing} from '../theme';

/* <View>   </View>  es un contenedor
   <Text>   </Text>  para agregar texto

            ejemplo:

                <View>
                     <Text>Hola</Text>
                </View> 


   StyleSheet  Sirve para crear estilos organizados

*/

/*  creamos la funcion. 
"export default" Permite que el componente sea usado en otros archivos, ejemplo import EtiquetaNivel from "./EtiquetaNivel"; . 
"function EtiquetaNivel() Define una función llamada EtiquetaNivel. 
" ({nivel})" Aquí recibe una prop "Recibe un objeto y extrae de él el nivel
" return( "  Lo que está dentro del return es lo que aparece en pantalla.

*/

export default function EtiquetaNivel ({nivel}) {

    return(
        <View style = {styles.contenedor}>
            <Text style = {styles.text}></Text>                 // los style son diferentes uno al otor view y text
        </View>

    )

    
}


/* para utlizar  "StyleSheet" su estructura siempre es :

            const styles = StyleSheet.create({
                    texto: {
                        fontSize: 20
                    }
            });    */


// se crea un objeto es una forma de guardar varios datos relacionados en una sola variable. este caso es un obejto dentro de un objeto

const styles = StyleSheet.create({
//Define el estilo del View
    contenedor: {                                               // PREGUNTAR A LA PROFE SI ESTE CONTENEDOR CORRESPONDE A "INFORMACION"
// Agrega espacio arriba y abajo.
        paddingVertical: 3,                                     // que unidad de medida es?    
// Agrega espacio a izquierda y derecha.
        paddingHorizontal : 2,
// hace que las esquinas queden con chaflan
        borderRadius: full,
//  Agrega un # de bordes.
        borderWidth:1,
    },
// Aquí irán los estilos para el texto.   
    text:{

            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 0.3


    }


})