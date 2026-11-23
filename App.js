
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function LoginScreen() {
  return <Screen title="Inicio de sesión" />;
}

function RegistroScreen() {
  return <Screen title="Registro de usuario" />;
}

function InventarioScreen() {
  return <Screen title="Inventario deportivo" />;
}

function MisPrestamosScreen() {
  return <Screen title="Mis préstamos" />;
}

function AdminScreen() {
  return <Screen title="Panel de administración" />;
}

function Screen({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Inventario" component={InventarioScreen} />
      <Tab.Screen name="Mis préstamos" component={MisPrestamosScreen} />
      <Tab.Screen name="Administración" component={AdminScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Inicio de sesión' }}
        />
        <Stack.Screen
          name="Registro"
          component={RegistroScreen}
          options={{ title: 'Registro' }}
        />
        <Stack.Screen
          name="Principal"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
