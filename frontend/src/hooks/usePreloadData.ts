import { useEffect, useState } from 'react';
import { pagesApi } from '../features/page/pageApi';
import { useAppDispatch } from '../store/hooks';
import { useGetHealthQuery } from '../features/health/healthApi';
import type { IPage } from '../features/page/pageTypes';

export const usePreloadData = () => {
  const dispatch = useAppDispatch();
  const { data: health, error: healthError, isLoading: healthLoading } = useGetHealthQuery();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<IPage[]>([]);
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

        const result = await dispatch(pagesApi.endpoints.getPages.initiate());

        if ('error' in result) {
          setError('Failed to preload pages');
        } else if ('data' in result) {
          setPages(result.data ?? []);
        }

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
  }, [dispatch, health, healthError, healthLoading]);

  return { loading, error, pages, progress };
};
