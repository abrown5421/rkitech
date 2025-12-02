import { useEffect, useState } from 'react';
import { useGetHealthQuery } from '../features/frontend/health/healthApi';

export const useCheckHealth = () => {
  const { data: health, error: healthError, isLoading: healthLoading } = useGetHealthQuery();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (healthLoading) return;

    if (healthError || !health?.success) {
      setError('Server health check failed');
      setLoading(false);
      return;
    }

    let progressInterval: ReturnType<typeof setInterval>;
    let completed = false;

    const preload = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        completed = true;
        setProgress(100);

        setTimeout(() => setLoading(false), 300);
      } catch (err) {
        console.error('Preload error:', err);
        setError('Failed to preload data');
        setLoading(false);
      }
    };

    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (completed) return prev;
        if (prev >= 99) return 99;
        return prev + 1;
      });
    }, 15);

    preload();

    return () => clearInterval(progressInterval);
  }, [health, healthError, healthLoading]);

  return { loading, error, progress };
};
