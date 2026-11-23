
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';

import Input from '../components/Input';
import Button from '../components/Button';
import Screen from '../components/Screen';
import { useAuth } from '../context/AuthContext';

export default function RegistroScreen({ navigation }) {
  const [form, setForm] = useState({
    nombre: '',
    matricula: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  function handleChange(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleRegister() {
    if (Object.values(form).some((value) => !value.trim())) {
      Alert.alert('Atención', 'Todos los campos son obligatorios.');
      return;
    }

    try {
      setLoading(true);

      await register(form);

      Alert.alert(
        'Registro exitoso',
        'Ya puedes iniciar sesión.',
        [
          {
            text: 'Aceptar',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error de registro', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={styles.card}>
        <Text style={styles.title}>Registro de usuario</Text>

        <Input
          label="Nombre completo"
          value={form.nombre}
          onChangeText={(value) => handleChange('nombre', value)}
          placeholder="Ingresa tu nombre"
        />

        <Input
          label="Matrícula"
          value={form.matricula}
          onChangeText={(value) => handleChange('matricula', value)}
          placeholder="Ingresa tu matrícula"
        />

        <Input
          label="Correo electrónico"
          value={form.email}
          onChangeText={(value) => handleChange('email', value)}
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
        />

        <Input
          label="Contraseña"
          value={form.password}
          onChangeText={(value) => handleChange('password', value)}
          placeholder="Crea una contraseña"
          secureTextEntry
        />

        <Button
          title={loading ? 'Registrando...' : 'Crear cuenta'}
          onPress={handleRegister}
          disabled={loading}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#172554',
    textAlign: 'center',
    marginBottom: 25,
  },
  link: {
    color: '#2563eb',
    textAlign: 'center',
    marginTop: 20,
  },
});
