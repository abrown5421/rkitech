import { useEffect, useState } from 'react';
import { useGetHealthQuery } from '../features/frontend/health/healthApi';

export const useCheckHealth = () => {
  const { data: health, error: healthError, isLoading: healthLoading } = useGetHealthQuery();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let completed = false;

    interval = setInterval(() => {
      setProgress((prev) => {
        if (completed) return prev;
        if (prev >= 99) return 99; 
        return prev + 1;
      });
    }, 15);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (healthLoading) return;

    if (healthError || !health?.success) {
      setError('Server health check failed, is the backend running?');
      setLoading(false);
      setProgress(0);
      return;
    }

    const finishProgress = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); 
      setProgress(100);
      setLoading(false); 
    };

    finishProgress();
  }, [health, healthError, healthLoading]);

  return { loading, error, progress };
};
