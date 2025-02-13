// This should do the following:
// 1. Show the user a button to start the exercise. Above the button, show the user the text "Hablamos de tu cumpleaños"
// 2. When the user clicks the button, communication with the backend should start.
// 3. The backend will send a message to the user.
// 4. The message will be shown to the user.
// 5. The user can type a response to the message.
// 6. The response will be sent to the backend.
// 7. The backend will send a response to the user.
// 8. This will repeat until the backend sends a message with an end_conversation flag set to true.
// 9. When the conversation ends, the user will see a message "Gracias por participar"

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import config from '@/config';

type Message = {
  text: string;
  isUser: boolean;
};

const FirstExercise = () => {
  // Stores exercise data (objectives, vocabulary) fetched from backend
  const [exerciseData, setExerciseData] = useState<any>(null);
  
  // Tracks if the exercise has been started by user clicking "Empezar"
  const [started, setStarted] = useState(false);
  
  // Array of chat messages between user and bot
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Current text in the input field
  const [userInput, setUserInput] = useState('');
  
  // Tracks if the conversation has ended
  const [isEnded, setIsEnded] = useState(false);
  
  // Reference to ScrollView for auto-scrolling to bottom
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Reference to TextInput for maintaining focus
  const inputRef = useRef<TextInput>(null);

  const addMessage = (text: string, isUser: boolean) => {
    setMessages(prev => [...prev, { text, isUser }]);
    // Scroll to bottom after message is added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/exercise/1`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setExerciseData(data);
      } catch (error) {
        console.error('Error fetching exercise:', error);
        // Handle error (maybe show error message to user)
      }
    };

    fetchExerciseData();
  }, []);

  const startExercise = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/exercise/start`, {
        method: 'POST'
      });
      const data = await response.json();
      addMessage(data.message, false);
      setStarted(true);
    } catch (error) {
      addMessage('Error starting exercise', false);
      console.error('Error:', error);
    }
  };

  const messageExchange = async () => {
    if (!userInput.trim()) return;
    
    const messageText = userInput;
    setUserInput('');
    addMessage(messageText, true);

    
    try {
      const response = await fetch(`${config.apiUrl}/exercise/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: messageText }),
      });
      const data = await response.json();
      addMessage(data.message, false);
      inputRef.current?.focus();
      if (data.end_conversation) {
        setIsEnded(true);
      }
    } catch (error) {
      addMessage('Error sending response', false);
      console.error('Error:', error);
    }
  };


  if (!started) {
      if (!exerciseData) {
        return <Text>Loading...</Text>;  // Or a loading spinner
      }

    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>{exerciseData.title}</Text>
        <Text style={styles.objectivesTitle}>✅ Objectives:</Text>
        <View style={styles.objectivesList}>
          {exerciseData.objectives.map((objective: string, index: number) => (
            <Text key={index} style={styles.objectiveItem}>{objective}</Text>
          ))}
          <Text style={styles.objectiveItem}>💬 Use the following vocabulary: {exerciseData.vocabulary.join(', ')}</Text>
        </View>
        <Button title="Empezar" onPress={startExercise} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <Text style={styles.headerText}>
        {isEnded ? 'Gracias por participar' : 'Hablamos de tu cumpleaños'}
      </Text>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.isUser ? styles.userMessage : styles.botMessage
            ]}
          >
            <Text style={[
              styles.messageText,
              msg.isUser ? styles.userMessageText : styles.botMessageText
            ]}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {!isEnded && (
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Type your response. If you feel like you've reached all objectives, say goodbye to end the conversation."
            onSubmitEditing={messageExchange}
            returnKeyType="send"
            autoFocus={true}
          />
          <Button title="Send" onPress={messageExchange} disabled={!userInput.trim()} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerText: {
    fontSize: 24,
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  objectivesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  objectivesList: {
    paddingLeft: 16,
    alignSelf: 'center',
  },
  objectiveItem: {
    fontSize: 16,
    marginVertical: 4,
    textAlign: 'left'
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 5,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: '#fff',
  },
});

export default FirstExercise;










