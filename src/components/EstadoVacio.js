import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

export default function EstadoVacio({ icono = 'alert-circle-outline', titulo = 'Vacío', mensaje = '', onAction }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icono} size={48} color={colors.textoSuave} />
      <Text style={[typography.titulo, styles.titulo]}>{titulo}</Text>
      <Text style={styles.mensaje}>{mensaje}</Text>
      {onAction && (
        <Pressable onPress={onAction} style={styles.boton}>
          <Text style={styles.botonTexto}>Reiniciar</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  titulo: { marginTop: spacing.md },
  mensaje: { color: colors.textoSuave, textAlign: 'center', marginTop: spacing.sm },
  boton: { marginTop: spacing.md, backgroundColor: colors.primario, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  botonTexto: { color: '#fff', fontWeight: '700' },
});
