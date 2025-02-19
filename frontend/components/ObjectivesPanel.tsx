import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  objectives: string[];
  completedObjectives: number[];
};

export function ObjectivesPanel({ objectives, completedObjectives }: Props) {
  const [showObjectives, setShowObjectives] = useState(false);

  return (
    <>
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

      {showObjectives && (
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
      )}
    </>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    padding: 8,
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
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
