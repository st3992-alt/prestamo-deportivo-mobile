
import { View, StyleSheet, ScrollView } from 'react-native';

export default function Screen({ children }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1f5f9',
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    width: '100%',
  },
});
