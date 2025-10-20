import { useEffect, useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { pagesApi } from '../features/page/pageApi';

export const usePreloadData = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const preload = async () => {
      try {
        await Promise.all([
          dispatch(pagesApi.endpoints.getPages.initiate()),
        ]);

        setLoading(false);
      } catch (err) {
        console.error('Preload error:', err);
        setError('Failed to preload data');
      }
    };
    setTimeout(() => {
        preload();
    }, 2000)
  }, [dispatch]);

  return { loading, error };
};
