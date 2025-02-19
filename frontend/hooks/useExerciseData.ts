import { useState, useEffect } from 'react';
import { Exercise } from '@/types/exercise';
import config from '@/config';

export function useExerciseData(exerciseId: string) {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.apiUrl}/exercise/${exerciseId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setExercise(data);
      } catch (error) {
        console.error('Error fetching exercise:', error);
        setError('Error fetching exercise data');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  return { exercise, error, loading };
}
