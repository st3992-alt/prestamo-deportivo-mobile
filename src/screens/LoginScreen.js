
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

export default function LoginScreen({ navigation }) {
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  async function handleLogin() {
    if (!matricula.trim() || !password.trim()) {
      Alert.alert('Atención', 'Completa todos los campos.');
      return;
    }

    try {
      setLoading(true);

      await login({
        matricula,
        password,
      });
    } catch (error) {
      Alert.alert('Error de inicio de sesión', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={styles.card}>
        <Text style={styles.title}>Inicio de sesión</Text>

        <Text style={styles.subtitle}>
          Ingresa tus datos para continuar.
        </Text>

        <Input
          label="Matrícula"
          value={matricula}
          onChangeText={setMatricula}
          placeholder="Ingresa tu matrícula"
        />

        <Input
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          placeholder="Ingresa tu contraseña"
          secureTextEntry
        />

        <Button
          title={loading ? 'Ingresando...' : 'Iniciar sesión'}
          onPress={handleLogin}
          disabled={loading}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Registro')}
        >
          <Text style={styles.link}>
            ¿No tienes cuenta? Regístrate
          </Text>
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
    fontSize: 25,
    fontWeight: 'bold',
    color: '#172554',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 25,
  },
  link: {
    color: '#2563eb',
    textAlign: 'center',
    marginTop: 22,
    fontWeight: '600',
  },
});
