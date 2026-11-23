
import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  Pressable,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { apiFetch } from '../services/api';

export default function AdminScreen() {
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);

      const [usersResponse, loansResponse] = await Promise.all([
        apiFetch('/api/users'),
        apiFetch('/api/sports/loans'),
      ]);

      setUsers(
        Array.isArray(usersResponse)
          ? usersResponse
          : usersResponse.users || []
      );

      setLoans(
        Array.isArray(loansResponse)
          ? loansResponse
          : loansResponse.loans || []
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  async function cambiarRol(userId, newRole) {
    try {
      await apiFetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({
          rol: newRole,
        }),
      });

      Alert.alert('Éxito', 'Rol actualizado correctamente.');

      cargarDatos();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  function renderUser({ item }) {
    const id = item._id || item.id;
    const role = item.rol || item.role || 'USER';

    return (
      <View style={styles.card}>
        <Text style={styles.name}>
          {item.nombre || item.name || 'Sin nombre'}
        </Text>

        <Text>Matrícula: {item.matricula || 'No disponible'}</Text>
        <Text>Rol: {role}</Text>

        <View style={styles.roleButtons}>
          <Pressable
            style={styles.roleButton}
            onPress={() => cambiarRol(id, 'USER')}
          >
            <Text style={styles.roleText}>USER</Text>
          </Pressable>

          <Pressable
            style={[styles.roleButton, styles.adminButton]}
            onPress={() => cambiarRol(id, 'ADMIN')}
          >
            <Text style={styles.roleText}>ADMIN</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de administración</Text>

      {loading ? (
        <Text>Cargando información...</Text>
      ) : (
        <>
          <View style={styles.summary}>
            <View style={styles.summaryCard}>
              <Text style={styles.number}>{users.length}</Text>
              <Text>Usuarios</Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.number}>{loans.length}</Text>
              <Text>Préstamos</Text>
            </View>
          </View>

          <Text style={styles.subtitle}>Gestión de usuarios</Text>

          <FlatList
            data={users}
            keyExtractor={(item) => String(item._id || item.id)}
            renderItem={renderUser}
            ListEmptyComponent={
              <Text>No hay usuarios registrados.</Text>
            }
            contentContainerStyle={styles.list}
            refreshing={loading}
            onRefresh={cargarDatos}
          />

          <Text style={styles.subtitle}>
            Préstamos registrados: {loans.length}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 18,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#172554',
    marginBottom: 18,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#172554',
    marginVertical: 15,
  },
  summary: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 15,
  },
  summaryCard: {
    flex: 1,
    padding: 18,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  number: {
    color: '#2563eb',
    fontSize: 28,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#172554',
    marginBottom: 8,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  roleButton: {
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 6,
  },
  adminButton: {
    backgroundColor: '#172554',
  },
  roleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 15,
  },
});
