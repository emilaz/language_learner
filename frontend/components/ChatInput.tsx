import { View, TextInput, Button, StyleSheet } from 'react-native';

type ChatInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
  ref?: React.RefObject<TextInput>;
};

export function ChatInput({ value, onChangeText, onSend, disabled, ref}: ChatInputProps) {
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
      />
      <Button title="Send" onPress={onSend} disabled={disabled || !value.trim()} />
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