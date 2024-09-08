import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const API_URL = 'https://1e37-110-224-95-183.ngrok-free.app';

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello, how can I assist today?', sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    if (inputText.trim()) {
      const newMessage: Message = { id: messages.length + 1, text: inputText, sender: 'user' };
      setMessages([...messages, newMessage]);
      setInputText('');

      setIsLoading(true);
      try {
        console.log('Sending request to:', `${API_URL}/chat`);
        const res = await axios.post(`${API_URL}/chat`, { prompt: inputText });
        console.log('Received response:', res.data);
        
        const botResponse: Message = { 
          id: messages.length + 2, 
          text: res.data.response, 
          sender: 'bot' 
        };
        setMessages(prevMessages => [...prevMessages, botResponse]);
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
        const errorMessage: Message = {
          id: messages.length + 2,
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          sender: 'bot'
        };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VetBot</Text>
      </View>
      <ScrollView 
        style={styles.chatContainer} 
        ref={scrollViewRef}
        contentContainerStyle={styles.chatContentContainer}
      >
        {messages.map((message) => (
          <View key={message.id} style={[
            styles.messageContainer,
            message.sender === 'user' ? styles.userMessage : styles.botMessage
          ]}>
            {message.sender === 'bot' && (
              <View style={styles.botIconContainer}>
                <MaterialIcons name="smart-toy" size={20} color="#007BFF" />
              </View>
            )}
            <View style={styles.messageContent}>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.cameraButton}>
          <MaterialIcons name="camera-alt" size={24} color="#007BFF" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <MaterialIcons name="send" size={24} color="#007BFF" />
        </TouchableOpacity>
      </View>
      {isLoading && <Text style={styles.loadingText}>Bot is typing...</Text>}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  chatContainer: {
    flex: 1,
  },
  chatContentContainer: {
    padding: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  botIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  messageContent: {
    backgroundColor: '#E1E1E1',
    borderRadius: 20,
    padding: 10,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#E1E1E1',
    alignItems: 'center',
  },
  cameraButton: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
  },
  loadingText: {
    alignSelf: 'center',
    marginBottom: 10,
    color: '#007BFF',
  },
});

export default ChatScreen;
