
import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { apiFetch } from '../services/api';
import Button from '../components/Button';

export default function MisPrestamosScreen() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarPrestamos = useCallback(async () => {
    try {
      setLoading(true);

      const response = await apiFetch('/api/sports/loans');

      setLoans(
        Array.isArray(response)
          ? response
          : response.loans || []
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarPrestamos();
    }, [cargarPrestamos])
  );

  async function devolverPrestamo(id) {
    try {
      await apiFetch(`/api/sports/loans/${id}/return`, {
        method: 'PATCH',
      });

      Alert.alert('Éxito', 'Devolución registrada correctamente.');

      cargarPrestamos();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  function renderItem({ item }) {
    const id = item._id || item.id;
    const estado = item.estado || item.status;

    return (
      <View style={styles.card}>
        <Text style={styles.name}>
          {item.item?.nombre ||
            item.item?.name ||
            item.nombreMaterial ||
            'Préstamo'}
        </Text>

        <Text>Estado: {estado || 'No especificado'}</Text>

        <Text>
          Fecha:{' '}
          {item.fechaSolicitud
            ? new Date(item.fechaSolicitud).toLocaleDateString()
            : item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : 'No disponible'}
        </Text>

        {estado === 'APROBADO' && (
          <Button
            title="Registrar devolución"
            onPress={() => devolverPrestamo(id)}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis préstamos</Text>

      {loading ? (
        <Text>Cargando préstamos...</Text>
      ) : (
        <FlatList
          data={loans}
          keyExtractor={(item) => String(item._id || item.id)}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text>No tienes préstamos registrados.</Text>
          }
          refreshing={loading}
          onRefresh={cargarPrestamos}
          contentContainerStyle={styles.list}
        />
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
  list: {
    paddingBottom: 25,
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    marginBottom: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#172554',
    marginBottom: 10,
  },
});
