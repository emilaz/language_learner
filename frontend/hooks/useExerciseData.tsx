import { useState, useEffect } from 'react';
import config from '@/config';

export function useExerciseData(exerciseId: string) {
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
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

    fetchExerciseData();
  }, [exerciseId]);

  return { exercise, loading, error };
}
