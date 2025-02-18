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
import { v4 as uuidv4 } from 'uuid';
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, TextInput, Button, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
  const [showObjectives, setShowObjectives] = useState(false);
  const [sessionId] = useState(uuidv4());
  const [completedObjectives, setCompletedObjectives] = useState<boolean[]>(
    Array(exerciseData?.objectives?.length || 0).fill(false)
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const [userInput, setUserInput] = useState('');
  const [isEnded, setIsEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleError = (message: string) => {
    setError(message);
  };

  const handleNewCompletedObjectives = (newlyCompleted: number[]) => {
    setCompletedObjectives(prev => {
      const updated = [...prev];
      newlyCompleted.forEach(index => {
        if (index >= 0 && index < updated.length) {
          updated[index] = true;
        }
      });
      return updated;
    });
    
    setFeedbackMessage('Objective completed!');
    setTimeout(() => setFeedbackMessage(null), 2000);
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
          handleError('Error fetching exercise data');
        }
      };
  
      fetchExerciseData();
    }, []);


  const startExercise = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/exercise/start`, {
        method: 'POST',
        headers: {
          'X-Session-ID': sessionId
        }
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
        body: JSON.stringify(updatedMessages),
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId
        },
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

      if (data.completed_objectives && data.completed_objectives.length > 0) {
        handleNewCompletedObjectives(data.completed_objectives);
      }

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
        <Text style={styles.objectiveItem}>💬 Use the following vocabulary: 
        <Text style={[styles.objectiveItem, { fontWeight: 'bold' }]}>{' ' + exerciseData.vocabulary.join(', ')}</Text></Text>
        <Text style={styles.objectiveItem}>🥅 You have 10 messages to reach your goal. Good luck!</Text>
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
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {isEnded ? 'Gracias por participar' : 'Hablamos de tu cumpleaños'}
        </Text>
        <TouchableOpacity 
          onPress={() => setShowObjectives(!showObjectives)}
          style={styles.toggleButton}
        >
          <MaterialIcons 
            name={showObjectives ? 'close' : 'info-outline'} 
            size={24} 
            color="#007AFF" 
          />
        </TouchableOpacity>
      </View>

      {showObjectives && (
        <View style={styles.objectivesPanel}>
          <Text style={styles.objectivesTitle}>Your Objectives:</Text>
          {exerciseData.objectives.map((obj: string, index: number) => (
            <View key={index} style={styles.objectiveItemToggled}>
              <MaterialIcons
                name={completedObjectives[index] ? 'check-box' : 'check-box-outline-blank'}
                size={20}
                color="#007AFF"
              />
              <Text style={styles.objectiveText}>{obj}</Text>
            </View>
          ))}
        </View>
      )}

      {feedbackMessage && (
        <View style={styles.feedbackToast}>
          <Text style={styles.feedbackText}>{feedbackMessage}</Text>
        </View>
      )}
      
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  toggleButton: {
    padding: 8,
  },
  objectivesPanel: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  objectiveItemToggled: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  objectiveText: {
    marginLeft: 8,
    fontSize: 16,
  },
  feedbackToast: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,122,255,0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  feedbackText: {
    color: 'white',
    fontSize: 14,
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










