import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatearPrecio } from '../data/clases';
import { colors, spacing, typography } from '../theme';
import { useClases } from '../context/ClasesContext';

export default function DetalleClaseScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { clase: claseParam } = route.params || {};
  const { clases, reservarClase, cancelarClase, reservadas } = useClases();

  const clase = clases.find((c) => c.id === (claseParam?.id ?? claseParam));
  if (!clase) return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}> 
      <Text style={typography.titulo}>Clase no encontrada</Text>
    </View>
  );

  const estaReservada = reservadas.has(clase.id);

  function handleReservar() {
    if (clase.cupos <= 0) {
      Alert.alert('Sin cupos', 'Lo sentimos, no hay cupos disponibles.');
      return;
    }
    reservarClase(clase.id);
    Alert.alert('Reserva confirmada', 'Has reservado la clase.');
  }

  function handleCancelar() {
    if (!estaReservada) {
      Alert.alert('No reservada', 'No tienes una reserva activa para esta clase.');
      return;
    }
    cancelarClase(clase.id);
    Alert.alert('Reserva cancelada', 'Se ha liberado el cupo de la clase.');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}> 
      <Image source={{ uri: clase.imagen }} style={styles.image} />
      <Text style={styles.title}>{clase.titulo}</Text>
      <Text style={styles.subtitle}>{clase.nivel} • {clase.modalidad} • {clase.duracion} min</Text>
      <Text style={styles.price}>{formatearPrecio(clase.precio)}</Text>
      <Text style={styles.description}>{clase.descripcion}</Text>

      <Text style={styles.cupos}>Cupos disponibles: {clase.cupos}</Text>

      <View style={styles.actions}>
        <Pressable style={[styles.button, { backgroundColor: colors.primario }]} onPress={handleReservar}>
          <Text style={styles.buttonText}>Reservar</Text>
        </Pressable>
        <Pressable style={[styles.button, { backgroundColor: colors.error }]} onPress={handleCancelar}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo, paddingHorizontal: spacing.lg },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: spacing.md },
  title: { fontSize: 20, fontWeight: '700', color: colors.texto, marginBottom: spacing.xs },
  subtitle: { color: colors.textoSuave, marginBottom: spacing.sm },
  price: { color: colors.primario, fontWeight: '700', marginBottom: spacing.sm },
  description: { color: colors.texto, marginBottom: spacing.sm },
  cupos: { fontWeight: '700', marginVertical: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between' },
  button: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
