
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const APP_TOKEN = process.env.EXPO_PUBLIC_API_APP_TOKEN;

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export async function apiFetch(endpoint, options = {}) {
  if (!API_URL) {
    throw new Error('No se ha configurado la URL de la API.');
  }

  const userToken = await SecureStore.getItemAsync('user_jwt_token');

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-token': APP_TOKEN,
      ...(userToken && {
        Authorization: `Bearer ${userToken}`,
      }),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    await SecureStore.deleteItemAsync('user_jwt_token');
    await SecureStore.deleteItemAsync('user_data');

    if (unauthorizedHandler) {
      unauthorizedHandler();
    }

    throw new Error('Tu sesión expiró. Inicia sesión nuevamente.');
  }

  if (response.status === 403) {
    throw new Error('No tienes permisos para realizar esta acción.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || `Error en la solicitud: ${response.status}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
