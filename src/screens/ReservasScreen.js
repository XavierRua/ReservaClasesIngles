// es la pantalla de la pestaña Mis reservas, aca se va a mostrar las reserva que el usuario ha hecho, y se puede ver la informacion de cada reserva


import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EtiquetaNivel from '../components/EtiquetaNivel';
import EstadoVacio from '../components/EstadoVacio';
import useReserva from '../hooks/useReserva';
import { formatearPrecio } from '../data/clases';
import { colors, radius, spacing, sombra } from '../theme';

// Convierte la fecha guardada (ISO) en algo legible: 5 oct 2026
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Fila con ícono + texto dentro de la tarjeta
function InfoRow({ icon, text }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color={colors.textoSuave} />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

// Tarjeta de una reserva
function ReservationCard({ reservation }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{reservation.title}</Text>
        <EtiquetaNivel nivel={reservation.level} />
      </View>

      <View style={styles.scheduleBox}>
        <Ionicons name="calendar" size={18} color={colors.primario} />
        <Text style={styles.scheduleText}>{reservation.schedule}</Text>
      </View>

      <InfoRow icon="person-outline" text={`Profesor: ${reservation.teacher}`} />
      {reservation.modality && (
        <InfoRow icon="videocam-outline" text={`${reservation.modality} • ${reservation.duration} min`} />
      )}
      <InfoRow icon="cash-outline" text={formatearPrecio(reservation.price)} />
      <InfoRow icon="time-outline" text={`Reservada el ${formatDate(reservation.createdAt)}`} />
    </View>
  );
}

export default function ReservasScreen() {
  const { reservations, loading } = useReserva();

  // Mientras se leen las reservas del celular
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primario} />
      </View>
    );
  }

  // Las más recientes primero (se copia el arreglo para no modificar el original)
  const sortedReservations = [...reservations].reverse();

  return (
    <FlatList
      style={styles.screen}
      data={sortedReservations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ReservationCard reservation={item} />}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        reservations.length > 0 ? (
          <Text style={styles.counter}>
            {reservations.length} {reservations.length === 1 ? 'reserva' : 'reservas'}
          </Text>
        ) : null
      }
      ListEmptyComponent={
        <EstadoVacio
          icono="calendar-outline"
          titulo="Sin reservas"
          mensaje="Aún no has reservado ninguna clase. Ve a Inicio, elige una clase y resérvala."
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.fondo },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.fondo },
  list: { padding: spacing.lg, flexGrow: 1 },
  counter: { color: colors.textoSuave, marginBottom: spacing.md },
  card: {
    backgroundColor: colors.superficie,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...sombra,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.texto },
  scheduleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primarioSuave,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  scheduleText: { color: colors.primario, fontWeight: '700', fontSize: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  infoText: { color: colors.texto },
});