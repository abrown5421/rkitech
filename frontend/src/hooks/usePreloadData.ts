import { useEffect, useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { pagesApi } from '../features/page/pageApi';
import type { IPage } from '../features/page/pageTypes';

export const usePreloadData = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<IPage[]>([]);

  useEffect(() => {
    const preload = async () => {
      try {
        const result = await dispatch(pagesApi.endpoints.getPages.initiate());

        if ('error' in result) {
          setError('Failed to preload pages');
        } else if ('data' in result) {
          setPages(result.data ?? []);
        }

        setLoading(false);
      } catch (err) {
        console.error('Preload error:', err);
        setError('Failed to preload data');
        setLoading(false);
      }
    };

    setTimeout(preload, 2000);
  }, [dispatch]);

  return { loading, error, pages };
};
