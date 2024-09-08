import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios, { AxiosError } from 'axios';
import * as ImagePicker from 'expo-image-picker';

const ChatBot = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const API_URL = 'https://1e37-110-224-95-183.ngrok-free.app';

  const handleChat = async () => {
    try {
      console.log('Sending request to:', `${API_URL}/chat`);
      const res = await axios.post(`${API_URL}/chat`, { prompt: 'Hello' });
      console.log('Received response:', res.data);
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error details:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      } else if (error instanceof Error) {
        console.error('Error message:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      const filename = localUri.split('/').pop() || '';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      const imageBlob = {
        uri: localUri,
        type: type,
        name: filename,
      } as any;
      formData.append('file', imageBlob);

      try {
        const res = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(res.data.message);
        setImageUri(localUri);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Add a test function
  const testConnection = async () => {
    try {
      console.log('Testing connection to:', `${API_URL}/hello`);
      const res = await axios.get(`${API_URL}/hello`);
      console.log('Test response:', res.data);
    } catch (error) {
      console.error('Test error:', error);
    }
  };

  // Call this function when component mounts
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter your prompt"
        value={prompt}
        onChangeText={setPrompt}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleChat}>
        <Text style={styles.buttonText}>SEND</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleImageUpload}>
        <Text style={styles.buttonText}>UPLOAD IMAGE</Text>
      </TouchableOpacity>
      {response ? <Text style={styles.response}>{response}</Text> : null}
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    width: '100%',
    backgroundColor: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  response: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});

export default ChatBot;
