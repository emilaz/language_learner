import { View, Text, StyleSheet } from 'react-native';

type ChatMessageProps = {
  text: string;
  isUser: boolean;
};

export function ChatMessage({ text, isUser }: ChatMessageProps) {
  return (
    <View style={[styles.messageBubble, isUser ? styles.userMessage : styles.botMessage]}>
      <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.botMessageText]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
}); 