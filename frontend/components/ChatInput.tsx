import React, { forwardRef } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

type ChatInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export const ChatInput = forwardRef<TextInput, ChatInputProps>(({ 
  value, onChangeText, onSend, disabled 
}, ref) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type your response..."
        onSubmitEditing={onSend}
        returnKeyType="send"
        ref={ref}
        blurOnSubmit={false}
      />
      <Button 
        title="Send" 
        onPress={onSend} 
        disabled={disabled || !value.trim()} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
