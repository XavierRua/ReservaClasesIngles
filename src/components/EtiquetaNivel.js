import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { coloresPorNivel, spacing, radius } from '../theme';

export default function EtiquetaNivel({ nivel }) {
  const bg = coloresPorNivel[nivel] ?? '#E5E7EB';
  return (
    <View style={[styles.container, { backgroundColor: bg }]}> 
      <Text style={styles.text}>{nivel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  text: { color: '#fff', fontWeight: '700', fontSize: 12 },
});
