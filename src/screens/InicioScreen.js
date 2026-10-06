// pantalla de inicio, donde se muestran todas las clases disponibles y se puede filtrar por nivel y buscar por texto

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import NivelChip from '../components/NivelChip';
import EstadoVacio from '../components/EstadoVacio';
import useResponsive from '../hooks/useResponsive';
import useReserva from '../hooks/useReserva';
import { colors, radius, spacing, typography } from '../theme';
import { NIVELES } from '../data/clases';
import { useClases } from '../context/ClasesContext';

export default function InicioScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [level, setLevel] = useState('Todos');
  const [search, setSearch] = useState('');

  // useResponsive y useClases devuelven nombres en español: se renombran al recibirlos
  const { columnas: columns } = useResponsive();
  const { clases: classes } = useClases();
  const { getAvailableSeats } = useReserva();

  // Filtra las clases por nivel y por texto (título o profesor)
  const results = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    return classes.filter((classItem) => {
      const matchesLevel = level === 'Todos' || classItem.nivel === level;
      const matchesText =
        !searchText ||
        classItem.titulo.toLowerCase().includes(searchText) ||
        classItem.profesor.nombre.toLowerCase().includes(searchText);
      return matchesLevel && matchesText;
    });
  }, [level, search, classes]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Text style={typography.titulo}>Clases de inglés</Text>

        //Buscador 
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textoSuave} />
          <TextInput
            style={styles.input}
            placeholder="Buscar por clase o profesor"
            placeholderTextColor={colors.textoSuave}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
          />
          {search.length > 0 && (
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.textoSuave}
              onPress={() => setSearch('')}
            />
          )}
        </View>
      </View>

      {/* Filtro por nivel */}
      <ScrollView
        style={styles.chipsScroll}
        contentContainerStyle={styles.chips}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {NIVELES.map((item) => (
          <NivelChip
            key={item}
            etiqueta={item}
            activo={item === level}
            onPress={() => setLevel(item)}
          />
        ))}
      </ScrollView>

      {/* Lista de clases */}
      <FlatList
        key={columns} // al cambiar el número de columnas la lista se vuelve a crear
        data={results}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        renderItem={({ item }) => (
          <Card
            clase={item}
            availableSeats={getAvailableSeats(item)}
            onPress={() => navigation.navigate('DetalleClase', { classItem: item })}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EstadoVacio
            icono="search-outline"
            titulo="No encontramos resultados"
            mensaje="La combinación de búsqueda no tiene resultados"
            onAction={() => {
              setLevel('Todos');
              setSearch('');
            }}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.fondo },
  header: { paddingHorizontal: spacing.lg },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.superficie,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 46,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.borde,
  },
  input: { flex: 1, fontSize: 14, color: colors.texto, paddingVertical: 0 },
  chipsScroll: { flexGrow: 0, marginVertical: spacing.md },
  chips: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.lg, flexGrow: 1 },
});