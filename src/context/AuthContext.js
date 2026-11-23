
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import * as SecureStore from 'expo-secure-store';
import {
  apiFetch,
  setUnauthorizedHandler,
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const savedUser = await SecureStore.getItemAsync('user_data');

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        await SecureStore.deleteItemAsync('user_jwt_token');
        await SecureStore.deleteItemAsync('user_data');
      } finally {
        setLoading(false);
      }
    }

    loadSession();

    setUnauthorizedHandler(() => {
      setUser(null);
    });

    return () => setUnauthorizedHandler(null);
  }, []);

  async function login(credentials) {
    const response = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const token = response.token || response.user_jwt_token;
    const userData = response.user;

    if (!token || !userData) {
      throw new Error('La respuesta de inicio de sesión no tiene el formato esperado.');
    }

    const normalizedUser = {
      ...userData,
      rol: userData.rol || userData.role,
    };

    await SecureStore.setItemAsync('user_jwt_token', token);
    await SecureStore.setItemAsync(
      'user_data',
      JSON.stringify(normalizedUser)
    );

    setUser(normalizedUser);

    return normalizedUser;
  }

  async function register(userData) {
    return apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async function logout() {
    await SecureStore.deleteItemAsync('user_jwt_token');
    await SecureStore.deleteItemAsync('user_data');
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
