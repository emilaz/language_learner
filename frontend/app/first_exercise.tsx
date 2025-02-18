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
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, TextInput, Button } from 'react-native';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { ErrorToast } from '@/components/ErrorToast';
import config from '@/config';

type Message = {
  text: string;
  isUser: boolean;
};

export default function FirstExercise() {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [exerciseData, setExerciseData] = useState<any>(null);

  const [userInput, setUserInput] = useState('');
  const [isEnded, setIsEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleError = (message: string) => {
    setError(message);
  };

    // Reference to TextInput for maintaining focus
    const inputRef = useRef<TextInput>(null);
    
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
      setMessages(prev => [...prev, { text: data.text, isUser: false }]);
      setStarted(true);
    } catch (error) {
      handleError('Error starting exercise');
    }
  };

  const sendResponse = async () => {
    if (!userInput.trim()) return;
    
    const messageText = userInput;
    setUserInput('');

    const updatedMessages = [...messages, { text: messageText, isUser: true }];
    setMessages(updatedMessages);

    try {
      const response = await fetch(`${config.apiUrl}/exercise/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message_history: updatedMessages.map(msg => ({
            text: msg.text,
            is_user: msg.isUser
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Handle different error formats from FastAPI
        const errorMessage = errorData?.detail ?
          (Array.isArray(errorData.detail) 
            ? errorData.detail[0]?.msg 
            : errorData.detail) 
          : 'Request failed';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.text, isUser: false }]);
      inputRef.current?.focus();

      if (data.end_conversation) {
        setIsEnded(true);
      }
    } catch (error) {
      handleError(
        error instanceof Error ? 
        error.message.replace('Error: ', '') :  // Remove any redundant 'Error:' prefix
        'Failed to send response. Please try again.'
      );
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
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
          <ChatMessage key={index} {...msg} />
        ))}
      </ScrollView>

      {!isEnded && (
        <ChatInput
          value={userInput}
          onChangeText={setUserInput}
          onSend={sendResponse}
          disabled={isEnded}
          ref={inputRef}
        />
      )}

      {error && (
        <ErrorToast 
          message={error} 
          onHide={() => setError(null)} 
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
});










