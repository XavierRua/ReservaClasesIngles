/* esta es la pantalla que se abre cuando el usuario toca una clase en la pestaña Inicio, 
 aca se puede ver la informacion de la clase y reservar un horario */
 
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { formatearPrecio } from '../data/clases';
import { colors, spacing, typography, radius } from '../theme';
import { useClases } from '../context/ClasesContext';
import useReserva from '../hooks/useReserva';

const DAY_NAMES = {
  Lun: 'Lunes',
  Mar: 'Martes',
  Mié: 'Miércoles',
  Jue: 'Jueves',
  Vie: 'Viernes',
  Sáb: 'Sábado',
  Dom: 'Domingo',
};

// Convierte ['Lun 7:00 a.m.', 'Mié 7:00 a.m.', 'Lun 6:00 p.m.']
// en [{ day: 'Lunes', hours: ['7:00 a.m.', '6:00 p.m.'] }, { day: 'Miércoles', hours: ['7:00 a.m.'] }]
function groupSchedules(list = []) {
  const groups = [];
  list.forEach((text) => {
    const spaceIndex = text.indexOf(' ');
    const shortDay = text.slice(0, spaceIndex);
    const hour = text.slice(spaceIndex + 1);
    const day = DAY_NAMES[shortDay] ?? shortDay;

    const group = groups.find((g) => g.day === day);
    if (group) group.hours.push(hour);
    else groups.push({ day, hours: [hour] });
  });
  return groups;
}

export default function DetalleClaseScreen({ route }) {
  const { classItem: classParam } = route.params || {};
  const { clases: classes } = useClases();
  const { reservations, addReservation, getAvailableSeats } = useReserva();

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  const classItem = classes.find((c) => c.id === (classParam?.id ?? classParam));
  if (!classItem) {
    return (
      <View style={styles.container}>
        <Text style={typography.titulo}>Clase no encontrada</Text>
      </View>
    );
  }

  const myReservation = reservations.find((r) => r.classId === classItem.id);
  const availableSeats = getAvailableSeats(classItem);
  const schedules = groupSchedules(classItem.horarios);
  const hoursOfDay = schedules.find((s) => s.day === selectedDay)?.hours ?? [];
  const canReserve = !myReservation && selectedDay && selectedHour && availableSeats > 0;

  function selectDay(day) {
    setSelectedDay(day);
    setSelectedHour(null); // al cambiar de día se borra la hora elegida
  }

  function handleReserve() {
    if (myReservation) {
      Alert.alert('Ya reservaste', 'Ya tienes una reserva para esta clase.');
      return;
    }
    if (availableSeats <= 0) {
      Alert.alert('Sin cupos', 'Lo sentimos, no hay cupos disponibles.');
      return;
    }
    if (!selectedDay || !selectedHour) {
      Alert.alert('Falta el horario', 'Elige un día y una hora antes de reservar.');
      return;
    }

    const schedule = `${selectedDay} ${selectedHour}`;
    addReservation(classItem, schedule);
    Alert.alert(
      'Reserva confirmada',
      `Reservaste la clase para el ${selectedDay} a las ${selectedHour}. Puedes verla en "Mis reservas".`
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: classItem.imagen }} style={styles.image} />
      <Text style={styles.title}>{classItem.titulo}</Text>
      <Text style={styles.subtitle}>
        {classItem.nivel} • {classItem.modalidad} • {classItem.duracion} min
      </Text>
      <Text style={styles.teacher}>Profesor: {classItem.profesor.nombre}</Text>
      <Text style={styles.price}>{formatearPrecio(classItem.precio)}</Text>
      <Text style={styles.description}>{classItem.descripcion}</Text>

      <Text style={styles.seats}>Cupos disponibles: {availableSeats}</Text>

      {/* ----- Reserva actual ----- */}
      {myReservation && (
        <View style={styles.currentReservation}>
          <Text style={styles.currentReservationText}>
            Tu reserva: {myReservation.schedule}
          </Text>
        </View>
      )}

      {!myReservation && (
        <>
          {/* ----- Selector de día ----- */}
          <Text style={styles.section}>Elige el día</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {schedules.map(({ day }) => {
              const active = day === selectedDay;
              return (
                <Pressable key={day} onPress={() => selectDay(day)} style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{day}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* ----- Selector de hora (aparece al elegir día) ----- */}
          {selectedDay && (
            <>
              <Text style={styles.section}>Elige la hora</Text>
              <View style={styles.grid}>
                {hoursOfDay.map((hour) => {
                  const active = hour === selectedHour;
                  return (
                    <Pressable key={hour} onPress={() => setSelectedHour(hour)} style={[styles.chip, active && styles.chipActive]}>
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>{hour}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          <Pressable
            style={[styles.button, !canReserve && styles.buttonDisabled]}
            onPress={handleReserve}
          >
            <Text style={styles.buttonText}>Reservar</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fondo },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  image: { width: '100%', height: 200, borderRadius: radius.sm, marginBottom: spacing.md },
  title: { fontSize: 20, fontWeight: '700', color: colors.texto, marginBottom: spacing.xs },
  subtitle: { color: colors.textoSuave, marginBottom: spacing.xs },
  teacher: { color: colors.textoSuave, marginBottom: spacing.sm },
  price: { color: colors.primario, fontWeight: '700', marginBottom: spacing.sm },
  description: { color: colors.texto, marginBottom: spacing.sm },
  seats: { fontWeight: '700', color: colors.texto, marginVertical: spacing.sm },
  section: { fontWeight: '600', color: colors.texto, marginTop: spacing.sm, marginBottom: spacing.xs },
  row: { gap: 8, paddingBottom: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borde,
    backgroundColor: colors.superficie,
  },
  chipActive: { backgroundColor: colors.primario, borderColor: colors.primario },
  chipText: { color: colors.texto },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  currentReservation: {
    padding: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.primario,
    backgroundColor: colors.primarioSuave,
    marginTop: spacing.sm,
  },
  currentReservationText: { color: colors.primario, fontWeight: '700' },
  button: {
    marginTop: spacing.lg,
    padding: 14,
    borderRadius: radius.sm,
    alignItems: 'center',
    backgroundColor: colors.primario,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '700' },
});