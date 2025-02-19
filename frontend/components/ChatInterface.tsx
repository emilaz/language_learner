import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

type ChatInterfaceProps = {
  messages: Array<{ text: string; isUser: boolean }>;
  onSend: (text: string) => void;
  isEnded: boolean;
  headerText: string;
  children?: React.ReactNode;
};

export function ChatInterface({ 
  messages, 
  onSend, 
  isEnded, 
  headerText,
  children 
}: ChatInterfaceProps) {
  const [userInput, setUserInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (userInput.trim()) {
      onSend(userInput);
      setUserInput('');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {isEnded ? 'Gracias por participar' : headerText}
        </Text>
      </View>

      {children}
      
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
          onSend={handleSend}
          disabled={isEnded}
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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 24,
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 10,
  },
});
