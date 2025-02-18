import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  objectives: string[];
  completedObjectives: boolean[];
};

export function ObjectivesPanel({ objectives, completedObjectives }: Props) {
  return (
    <View style={styles.objectivesPanel}>
      <Text style={styles.objectivesTitle}>Your Objectives:</Text>
      {objectives.map((obj, index) => (
        <View key={index} style={styles.objectiveItem}>
          <MaterialIcons
            name={completedObjectives[index] ? 'check-box' : 'check-box-outline-blank'}
            size={20}
            color="#007AFF"
          />
          <Text style={styles.objectiveText}>{obj}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  objectivesPanel: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  objectivesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  objectiveText: {
    marginLeft: 8,
    fontSize: 16,
  },
});
