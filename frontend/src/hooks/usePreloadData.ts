import { useEffect, useState } from 'react';
import { pagesApi } from '../features/page/pageApi';
import { useAppDispatch } from '../store/hooks';
import { useGetHealthQuery } from '../features/health/healthApi';
import type { IPage } from '../features/page/pageTypes';
import type { IConfiguration } from '../features/configurations/configurationsTypes';
import { configApi } from '../features/configurations/configurationsApi';
import { themeApi } from '../features/theme/themeApi';
import type { ITheme } from '../features/theme/themeTypes';

export const usePreloadData = () => {
  const dispatch = useAppDispatch();
  const { data: health, error: healthError, isLoading: healthLoading } = useGetHealthQuery();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<IPage[]>([]);
  const [configs, setConfigs] = useState<IConfiguration[]>([]);
  const [theme, setTheme] = useState<ITheme | null>(null);
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

        const [pagesResult, configResult, activeThemeResult] = await Promise.all([
          dispatch(pagesApi.endpoints.getPages.initiate()),
          dispatch(configApi.endpoints.getConfigs.initiate()),
          dispatch(themeApi.endpoints.getActiveTheme.initiate())
        ]);

        if ('error' in pagesResult) setError('Failed to load pages');
        else if ('data' in pagesResult) setPages(pagesResult.data ?? []);

        if ('error' in configResult) setError('Failed to load configurations');
        else if ('data' in configResult) setConfigs(configResult.data ?? []);

        if ('error' in activeThemeResult) setError('Failed to load active theme');
        else if ('data' in activeThemeResult) setTheme(activeThemeResult.data ?? null);

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

  return { loading, error, pages, configs, theme, progress };
};
