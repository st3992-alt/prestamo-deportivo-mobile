
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
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function InventarioScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const cargarInventario = useCallback(async () => {
    try {
      setLoading(true);

      const response = await apiFetch('/api/sports/items');

      setItems(
        Array.isArray(response)
          ? response
          : response.items || []
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarInventario();
    }, [cargarInventario])
  );

  async function solicitarPrestamo(item) {
    try {
      await apiFetch('/api/sports/loans', {
        method: 'POST',
        body: JSON.stringify({
          itemId: item._id || item.id,
        }),
      });

      Alert.alert('Solicitud enviada', 'Tu solicitud fue registrada.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        <Text style={styles.name}>
          {item.nombre || item.name || 'Material deportivo'}
        </Text>

        <Text>Tipo: {item.tipo || item.type || 'No especificado'}</Text>

        <Text>
          Cantidad: {item.cantidad ?? item.quantity ?? 'No disponible'}
        </Text>

        <Text>
          Estado: {item.estado || item.status || 'No especificado'}
        </Text>

        {user?.rol === 'USER' && (
          <Button
            title="Solicitar préstamo"
            onPress={() => solicitarPrestamo(item)}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventario deportivo</Text>

      {loading ? (
        <Text>Cargando inventario...</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item._id || item.id)}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text>No hay artículos disponibles.</Text>
          }
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={cargarInventario}
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
