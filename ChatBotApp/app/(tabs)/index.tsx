import React from 'react';
import { StyleSheet, View } from 'react-native';
import ChatScreen from '../../components/ChatScreen';

const App = () => {
  return (
    <View style={styles.container}>
      <ChatScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;