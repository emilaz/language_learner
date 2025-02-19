import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ExerciseMessage } from '@/types/exercise';
import config from '@/config';

export function useChatSession() {
  const [messages, setMessages] = useState<ExerciseMessage[]>([]);
  const [completedObjectives, setCompletedObjectives] = useState<number[]>([]);
  const [isEnded, setIsEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(uuidv4());

  const startChat = useCallback(async () => {
    try {
      const response = await fetch(`${config.apiUrl}/exercise/start`, {
        method: 'POST',
        headers: {
          'X-Session-ID': sessionId
        }
      });
      const data = await response.json();
      setMessages([{ text: data.text, isUser: false }]);
      return true;
    } catch (error) {
      setError('Error starting exercise');
      return false;
    }
  }, [sessionId]);

  const sendMessageAndGetReply = useCallback(async (text: string) => {
    const updatedMessages = [...messages, { text, isUser: true }];
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
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.text, isUser: false }]);
      
      if (data.end_conversation) {
        setIsEnded(true);
      }

      setCompletedObjectives(prev => [...prev, data.completed_objectives]);
    } catch (error) {
      setError('Failed to send message');
      return [];
    }
  }, [messages, sessionId]);

  return {
    messages,
    completedObjectives,
    isEnded,
    error,
    startChat,
    sendMessageAndGetReply,
    clearError: () => setError(null)
  };
}
