import React from 'react';
import React,{useState,useEffect} from 'react';
import { View, Text, Image, Pressable ,StyleSheet, TextInput } from "react-native";
import {useSafeAreaInsets} from 'react'
import {Ionicons} from '@expo/vector-icons'; 
import EtiquetaNivel from "./EtiquetaNivel";
import { colors, radius, spacing,typography } from "../theme";
import { CLASES, formatearPrecio } from "../data/clases";


// farla realizar importaciones revisara la foto

export default function clasesScreen ({navigation}){
    const [nivel, setNivel] = useState ('')
    const [busqueda ,setBusqueda]= useState ('')

    return(
        <View>
            <Text>Aplicacion para clase de ingles </Text>
            <Ionicons name = 'search' size ={18} color={colors.textoSuave}/>
            <TextInput
                placeholder='Buscar por nivel'
                value={nivel}
                onChangeText={setNivel}
            
            />

        </View>

    )

}