import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import config from '@/config';

type Message = {
  text: string;
  isUser: boolean;
};

export function useChatSession() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId] = useState(uuidv4());
  const [completedObjectives, setCompletedObjectives] = useState<boolean[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isEnded, setIsEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startSession = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/exercise/start`, {
        method: 'POST',
        headers: {
          'X-Session-ID': sessionId
        }
      });
      const data = await response.json();
      setMessages(prev => [...prev, { text: data.text, isUser: false }]);
    } catch (error) {
      setError('Error starting exercise');
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

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
        const errorData = await response.json();
        const errorMessage = errorData?.detail ?
          (Array.isArray(errorData.detail) 
            ? errorData.detail[0]?.msg 
            : errorData.detail) 
          : 'Request failed';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.text, isUser: false }]);

      if (data.completed_objectives?.length > 0) {
        handleNewCompletedObjectives(data.completed_objectives);
      }

      if (data.end_conversation) {
        setIsEnded(true);
      }
    } catch (error) {
      setError(
        error instanceof Error ? 
        error.message.replace('Error: ', '') : 
        'Failed to send response. Please try again.'
      );
    }
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
    
    setFeedback('Objective completed!');
    setTimeout(() => setFeedback(null), 2000);
  };

  return {
    messages,
    sessionId,
    completedObjectives,
    feedback,
    isEnded,
    error,
    startSession,
    sendMessage
  };
}
