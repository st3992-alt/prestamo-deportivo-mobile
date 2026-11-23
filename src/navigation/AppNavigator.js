import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import InventarioScreen from '../screens/InventarioScreen';
import MisPrestamosScreen from '../screens/MisPrestamosScreen';
import AdminScreen from '../screens/AdminScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { user, logout } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#172554',
        },
        headerTintColor: '#fff',
        tabBarActiveTintColor: '#2563eb',
      }}
    >
      <Tab.Screen
        name="Inventario"
        component={InventarioScreen}
      />

      <Tab.Screen
        name="Mis préstamos"
        component={MisPrestamosScreen}
      />

      {user?.rol === 'ADMIN' && (
        <Tab.Screen
          name="Administración"
          component={AdminScreen}
        />
      )}

      <Tab.Screen
        name="Cerrar sesión"
        component={LogoutScreen}
        options={{
          title: 'Cerrar sesión',
        }}
      />
    </Tab.Navigator>
  );
}

function LogoutScreen() {
  const { logout } = useAuth();

  React.useEffect(() => {
    logout();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen
          name="Principal"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Inicio de sesión' }}
          />

          <Stack.Screen
            name="Registro"
            component={RegistroScreen}
            options={{ title: 'Registro de usuario' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
