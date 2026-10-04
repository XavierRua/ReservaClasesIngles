import React from 'react';
import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import EtiquetaNivel from './EtiquetaNivel';
import { colors, radius, spacing, typography } from '../theme';
import { formatearPrecio } from '../data/clases';

export default function Card({ clase, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: clase.imagen }} style={styles.image} />
      <View style={styles.body}>
        <View style={styles.row}> 
          <EtiquetaNivel nivel={clase.nivel} />
          <Text style={styles.title}>{clase.titulo}</Text>
        </View>
        <Text style={styles.teacher}>{clase.profesor.nombre}</Text>
        <View style={styles.footer}>
          <Text style={styles.cupos}>Cupos: {clase.cupos}</Text>
          <Text style={styles.price}>{formatearPrecio(clase.precio)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.superficie, borderRadius: radius.lg, overflow: 'hidden', margin: spacing.sm, flex: 1, minWidth: 160 },
  image: { width: '100%', height: 120, backgroundColor: colors.primarioSuave },
  body: { padding: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { fontSize: 16, fontWeight: '700', color: colors.texto, marginLeft: spacing.sm, flex: 1 },
  teacher: { color: colors.textoSuave, marginTop: spacing.xs },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  cupos: { fontWeight: '700' },
  price: { color: colors.primario, fontWeight: '800' },
});