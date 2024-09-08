import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ChatScreen from './components/ChatScreen';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ChatScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default App;
