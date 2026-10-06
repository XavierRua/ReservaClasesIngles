/* es la pantalla de la pestaña Perfil, aca se va a mostrar el perfil del usuario, 
y se puede editar la informacion del perfil */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NivelChip from '../components/NivelChip';
import useAlmacenamiento from '../hooks/useAlmacenamiento';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { NIVELES } from '../data/clases';
import { colors, radius, spacing, sombra } from '../theme';

// Formulario vacío (cuando el estudiante no está registrado)
const EMPTY_PROFILE = { name: '', email: '', phone: '', level: '' };

// Niveles para elegir (sin la opción 'Todos' del filtro)
const PROFILE_LEVELS = NIVELES.filter((item) => item !== 'Todos');

// Campo de texto con su etiqueta
function FormField({ label, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={colors.textoSuave} {...inputProps} />
    </View>
  );
}

export default function PerfilScreen() {
  // Si no hay nada guardado, profile queda en null = no registrado
  const { value: profile, update, ready } = useAlmacenamiento(STORAGE_KEYS.PROFILE, null);
  const [form, setForm] = useState(EMPTY_PROFILE);
  const isRegistered = profile !== null;

  // Cuando termina de leer el celular, si hay perfil guardado, llena el formulario
  useEffect(() => {
    if (ready && profile) {
      setForm({ ...EMPTY_PROFILE, ...profile });
    }
  }, [ready, profile]);

  // Cambia un solo campo del formulario sin borrar los demás
  function changeField(field, text) {
    setForm((previous) => ({ ...previous, [field]: text }));
  }

  async function handleSave() {
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (!name || !email) {
      Alert.alert('Datos incompletos', 'El nombre y el correo son obligatorios.');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Correo no válido', 'Revisa que el correo tenga @.');
      return;
    }

    await update({ ...form, name, email, phone }); // renderiza la UI y guarda en el celular

    Alert.alert(
      isRegistered ? 'Perfil actualizado' : 'Registro exitoso',
      isRegistered ? 'Tus datos se actualizaron.' : 'Tus datos quedaron guardados.'
    );
  }

  // Mientras se lee el perfil del celular
  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primario} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Encabezado: cambia según si está registrado o no */}
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            {isRegistered ? (
              <Text style={styles.avatarLetter}>{profile.name.charAt(0).toUpperCase()}</Text>
            ) : (
              <Ionicons name="person-outline" size={32} color={colors.primario} />
            )}
          </View>
          <Text style={styles.headerTitle}>
            {isRegistered ? `Hola, ${profile.name}` : 'Crea tu perfil'}
          </Text>
          <Text style={styles.headerText}>
            {isRegistered
              ? 'Estos son tus datos guardados. Puedes actualizarlos cuando quieras.'
              : 'Aún no estás registrado. Completa el formulario para crear tu perfil.'}
          </Text>
        </View>

        {/* Formulario */}
        <FormField
          label="Nombre completo *"
          placeholder="Ej: Laura Gómez"
          value={form.name}
          onChangeText={(text) => changeField('name', text)}
        />
        <FormField
          label="Correo electrónico *"
          placeholder="Ej: laura@correo.com"
          value={form.email}
          onChangeText={(text) => changeField('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FormField
          label="Celular"
          placeholder="Ej: 3001234567"
          value={form.phone}
          onChangeText={(text) => changeField('phone', text)}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Nivel de inglés</Text>
        <View style={styles.levels}>
          {PROFILE_LEVELS.map((item) => (
            <NivelChip
              key={item}
              etiqueta={item}
              activo={item === form.level}
              onPress={() => changeField('level', item)}
            />
          ))}
        </View>

        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>{isRegistered ? 'Guardar cambios' : 'Registrarme'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.fondo },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.fondo },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  headerCard: {
    alignItems: 'center',
    backgroundColor: colors.superficie,
    borderRadius: radius.md,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...sombra,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarLetter: { fontSize: 28, fontWeight: '800', color: colors.primario },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.texto },
  headerText: { color: colors.textoSuave, textAlign: 'center', marginTop: spacing.xs },
  field: { marginBottom: spacing.md },
  label: { fontWeight: '600', color: colors.texto, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.superficie,
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.texto,
  },
  levels: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  button: {
    backgroundColor: colors.primario,
    borderRadius: radius.sm,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});