import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useExerciseData } from '@/hooks/useExerciseData';
import { useChatSession } from '@/hooks/useChatSession';
import { StartExerciseView } from '@/components/StartExerciseView';
import { ChatInterface } from '@/components/ChatInterface';
import { ObjectivesPanel } from '@/components/ObjectivesPanel';
import { ErrorToast } from '@/components/ErrorToast';

export default function FirstExercise() {
  const { exercise, loading, error: exerciseError } = useExerciseData('1');
  const {
    messages,
    isEnded,
    error: chatError,
    startChat,
    sendMessage,
    completedObjectives
  } = useChatSession();

  if (loading) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      {exerciseError && <ErrorToast message={exerciseError} />}
      
      {exercise ? (
        !messages.length ? (
          <StartExerciseView 
            exercise={exercise}
            onStart={startChat}
          />
        ) : (
          <ChatInterface
            messages={messages}
            onSend={sendMessage}
            isEnded={isEnded}
            headerText={isEnded ? 'Gracias por participar' : 'Hablamos de tu cumpleaños'}
          >
            <ObjectivesPanel
              objectives={exercise.objectives}
              completedObjectives={completedObjectives}
            />
            
            {chatError && <ErrorToast message={chatError} />}
          </ChatInterface>
        )
      ) : (
        <ErrorToast message="Failed to load exercise" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});










