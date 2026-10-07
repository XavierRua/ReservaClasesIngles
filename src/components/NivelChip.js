// botones de basico, intermedio y avanzado que se usan en la pantalla de clases

import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '../theme/index';

// Botón de nivel (Todos, Basico, Intermedio...)
// Se usa en InicioScreen (filtro) y en PerfilScreen (elegir nivel)
export default function NivelChip({ etiqueta, activo, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        activo && styles.chipActive,
        pressed && styles.chipPressed,
      ]}
    >
      <Text style={[styles.text, activo && styles.textActive]}>{etiqueta}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start', // el chip mide solo lo que necesita su texto
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    backgroundColor: colors.superficie,
    borderWidth: 1,
    borderColor: colors.borde,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.primario,
    borderColor: colors.primario,
  },
  chipPressed: { opacity: 0.7 },
  text: { fontSize: 13, fontWeight: '600', color: colors.textoSuave },
  textActive: { color: '#FFFFFF' },
});