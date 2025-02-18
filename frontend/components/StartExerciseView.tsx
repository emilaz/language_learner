import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Exercise } from '@/types/exercise';

type Props = {
  exercise: Exercise;
  onStart: () => void;
};

export function StartExerciseView({ exercise, onStart }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{exercise.title}</Text>
      <Text style={styles.objectivesTitle}>✅ Objectives:</Text>
      <View style={styles.objectivesList}>
        {exercise.objectives.map((objective: string, index: number) => (
          <Text key={index} style={styles.objectiveItem}>{objective}</Text>
        ))}
        <Text style={styles.objectiveItem}>💬 Use the following vocabulary: 
          <Text style={[styles.objectiveItem, { fontWeight: 'bold' }]}>
            {' ' + exercise.vocabulary.join(', ')}
          </Text>
        </Text>
        <Text style={styles.objectiveItem}>🥅 You have 10 messages to reach your goal. Good luck!</Text>
      </View>
      <Button title="Empezar" onPress={onStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});
