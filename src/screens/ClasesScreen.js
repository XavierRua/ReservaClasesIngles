import React, { useState,  useMemo} from 'react';
import { View, Text, Image, Pressable, StyleSheet, TextInput, ScrollView, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import EtiquetaNivel from '../components/EtiquetaNivel';
import Card from '../components/Card';
import NivelChip from '../components/NivelChip';
import EstadoVacio from '../components/EstadoVacio';
import useResponsive from '../hooks/useResponsive';

import { colors, radius, spacing, typography} from '../theme';
import { formatearPrecio, NIVELES } from '../data/clases';
import { useClases } from '../context/ClasesContext';

export default function ClasesScreen ({ navigation }){
    const insets = useSafeAreaInsets();

    const [nivel, setNivel] = useState()
    const {columnas , paddingHorizontal} = useResponsive()
    const [busqueda, setBusqueda] = useState('')

    const { clases } = useClases();

    const resultados = useMemo(()=>{
        const textoBusqueda = busqueda.trim().toLowerCase();
        return clases.filter((clase)=>{
            const coincidenciaNivel = !nivel || nivel === 'Todos' || clase.nivel === nivel
            const coincidenciaTexto = !textoBusqueda ||
            clase.titulo.toLowerCase().includes(textoBusqueda) ||
            clase.profesor.nombre.toLowerCase().includes(textoBusqueda);
            return coincidenciaNivel && coincidenciaTexto
        });
    },[nivel, busqueda, clases]);

    return(
        <View style ={[style.pantalla, {paddingTop: insets.top + spacing.sm}]}>
            <View>
                <Text style={typography.titulo}> Aplicación para clases de ingles </Text>
                <Ionicons name="search" size={18} color={colors.textoSuave}/>
                <TextInput
                    placeholder = "Buscar por nivel"
                    value = {busqueda}
                    onChangetext= {setBusqueda}
                    autoCorrect={false} 
                />
                {/* función de búsqueda, condicional */}
                {
                    busqueda.length > 0 && (
                        <Ionicons
                            name='close-circle'
                            size={18}
                            color={colors.textoSuave}
                            onPress={()=> setBusqueda('')}
                        />
                    )


                }
            </View>
            <ScrollView
                style={{flewGrow: 0}}
                horizontal
            >
                {
                    NIVELES.map((item) => (
                        <NivelChip
                            key={item}
                            etiqueta = {item}
                            activo = {item}
                            onPress={() => setNivel(item)}
                        />
                    ))
                }

            </ScrollView>
            <FlatList 
                data = {resultados}
                keyExtractor={(item) => item.id}
                renderItem={({item})=>(
                    <Card 
                        clase={item}
                        onPress={()=> navigation.navigate('DetalleClase', {clase:item})}
                    />
                    
                )}
                showsVerticalScrollIndicator = {false}
                contentContainerStyle = {{
                    paddingHorizontal:12,
                    flexGrow: 1
                }}
                numColumns={ columnas }
                ListEmptyComponent={ 
                    <EstadoVacio 
                        icono="search-outline"
                        titulo="No encontramos resultados"
                        mensaje="La combinacion de busqueda no tiene resultados"
                        onAction={()=>{
                            setNivel('Todos');
                            setBusqueda('');
                        }}
                    />
                
                
                }
            />
            
        </View>
    )

};

const style = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.fondo },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.superficie,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 46,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borde,
  },
  input: { flex: 1, fontSize: 14, color: colors.texto, paddingVertical: 0 },
});