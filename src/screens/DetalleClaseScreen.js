import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatearPrecio } from '../data/clases';
import { colors, spacing, typography, radius } from '../theme';
import { useClases } from '../context/ClasesContext';

const NOMBRES_DIAS = {
  Lun: 'Lunes',
  Mar: 'Martes',
  Mié: 'Miércoles',
  Jue: 'Jueves',
  Vie: 'Viernes',
  Sáb: 'Sábado',
  Dom: 'Domingo',
};

// Convierte ['Lun 7:00 a.m.', 'Mié 7:00 a.m.', 'Lun 6:00 p.m.']
// en [{ dia: 'Lunes', horas: ['7:00 a.m.', '6:00 p.m.'] }, { dia: 'Miércoles', horas: ['7:00 a.m.'] }]
function agruparHorarios(lista = []) {
  const grupos = [];
  lista.forEach((texto) => {
    const espacio = texto.indexOf(' ');
    const abreviatura = texto.slice(0, espacio);
    const hora = texto.slice(espacio + 1);
    const dia = NOMBRES_DIAS[abreviatura] ?? abreviatura;

    const grupo = grupos.find((g) => g.dia === dia);
    if (grupo) grupo.horas.push(hora);
    else grupos.push({ dia, horas: [hora] });
  });
  return grupos;
}

export default function DetalleClaseScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { clase: claseParam } = route.params || {};
  const { clases, reservarClase, cancelarClase, reservadas } = useClases();

  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);

  const clase = clases.find((c) => c.id === (claseParam?.id ?? claseParam));
  if (!clase) return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <Text style={typography.titulo}>Clase no encontrada</Text>
    </View>
  );

  const estaReservada = reservadas.has(clase.id);
  const miReserva = reservadas.get(clase.id); // { dia, hora } o undefined
  const horarios = agruparHorarios(clase.horarios);
  const horasDelDia = horarios.find((h) => h.dia === diaSeleccionado)?.horas ?? [];
  const puedeReservar = !estaReservada && diaSeleccionado && horaSeleccionada && clase.cupos > 0;

  function elegirDia(dia) {
    setDiaSeleccionado(dia);
    setHoraSeleccionada(null); // al cambiar de día se borra la hora elegida
  }

  function handleReservar() {
    if (estaReservada) {
      Alert.alert('Ya reservaste', 'Cancela tu reserva actual si quieres cambiar el horario.');
      return;
    }
    if (clase.cupos <= 0) {
      Alert.alert('Sin cupos', 'Lo sentimos, no hay cupos disponibles.');
      return;
    }
    if (!diaSeleccionado || !horaSeleccionada) {
      Alert.alert('Falta el horario', 'Elige un día y una hora antes de reservar.');
      return;
    }
    reservarClase(clase.id, { dia: diaSeleccionado, hora: horaSeleccionada });
    Alert.alert(
      'Reserva confirmada',
      `Reservaste la clase para el ${diaSeleccionado} a las ${horaSeleccionada}.`
    );
  }

  function handleCancelar() {
    if (!estaReservada) {
      Alert.alert('No reservada', 'No tienes una reserva activa para esta clase.');
      return;
    }
    cancelarClase(clase.id);
    setDiaSeleccionado(null);
    setHoraSeleccionada(null);
    Alert.alert('Reserva cancelada', 'Se ha liberado el cupo de la clase.');
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.lg }}
    >
      <Image source={{ uri: clase.imagen }} style={styles.image} />
      <Text style={styles.title}>{clase.titulo}</Text>
      <Text style={styles.subtitle}>{clase.nivel} • {clase.modalidad} • {clase.duracion} min</Text>
      <Text style={styles.price}>{formatearPrecio(clase.precio)}</Text>
      <Text style={styles.description}>{clase.descripcion}</Text>

      <Text style={styles.cupos}>Cupos disponibles: {clase.cupos}</Text>

      {/* ----- Reserva actual ----- */}
      {estaReservada && miReserva && (
        <View style={styles.reservaActual}>
          <Text style={styles.reservaTexto}>
            Tu reserva: {miReserva.dia} a las {miReserva.hora}
          </Text>
        </View>
      )}

      {!estaReservada && (
      <>
      {/* ----- Selector de día ----- */}
      <Text style={styles.seccion}>Elige el día</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.fila}>
        {horarios.map(({ dia }) => {
          const activo = dia === diaSeleccionado;
          return (
            <Pressable key={dia} onPress={() => elegirDia(dia)} style={[styles.chip, activo && styles.chipActivo]}>
              <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>{dia}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ----- Selector de hora (aparece al elegir día) ----- */}
      {diaSeleccionado && (
        <>
          <Text style={styles.seccion}>Elige la hora</Text>
          <View style={styles.grilla}>
            {horasDelDia.map((hora) => {
              const activa = hora === horaSeleccionada;
              return (
                <Pressable key={hora} onPress={() => setHoraSeleccionada(hora)} style={[styles.chip, activa && styles.chipActivo]}>
                  <Text style={[styles.chipTexto, activa && styles.chipTextoActivo]}>{hora}</Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}
      </>
      )}

      <View style={styles.actions}>
        <Pressable
          style={[styles.button, { backgroundColor: colors.primario }, !puedeReservar && styles.buttonDesactivado]}
          onPress={handleReservar}
        >
          <Text style={styles.buttonText}>Reservar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo, paddingHorizontal: spacing.lg },
  image: { width: '100%', height: 200, borderRadius: radius.sm, marginBottom: spacing.md },
  title: { fontSize: 20, fontWeight: '700', color: colors.texto, marginBottom: spacing.xs },
  subtitle: { color: colors.textoSuave, marginBottom: spacing.sm },
  price: { color: colors.primario, fontWeight: '700', marginBottom: spacing.sm },
  description: { color: colors.texto, marginBottom: spacing.sm },
  cupos: { fontWeight: '700', marginVertical: spacing.sm },
  seccion: { fontWeight: '600', color: colors.texto, marginTop: spacing.sm, marginBottom: spacing.xs },
  fila: { gap: 8, paddingBottom: 4 },
  grilla: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borde,
    backgroundColor: colors.superficie,
  },
  chipActivo: { backgroundColor: colors.primario, borderColor: colors.primario },
  chipTexto: { color: colors.texto },
  chipTextoActivo: { color: '#fff', fontWeight: '700' },
  reservaActual: {
    padding: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.primario,
    backgroundColor: colors.primarioSuave,
    marginTop: spacing.sm,
  },
  reservaTexto: { color: colors.primario, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between', marginTop: spacing.lg },
  button: { flex: 1, padding: 12, borderRadius: radius.sm, alignItems: 'center' },
  buttonDesactivado: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '700' },
});