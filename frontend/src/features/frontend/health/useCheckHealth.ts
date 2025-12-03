import { useEffect, useState, useRef } from 'react';
import { useGetHealthQuery } from './healthApi';
import { useGetPagesQuery } from '../page/pageApi';
import type { IPage } from '../page/pageTypes';
import type { Theme } from '@mui/material';
import { useGetActiveThemeQuery } from '../../theme/themeApi';
import { buildThemeFromData, defaultTheme } from '../../theme/themeBuilder';
import type { HealthCheck } from './HealthTypes';

export const useCheckHealth = (loadBundle: () => Promise<any>) => {
  const { data: health, error: healthError, isLoading: healthLoading } = useGetHealthQuery();
  const [shouldFetchPages, setShouldFetchPages] = useState(false);
  const [shouldFetchTheme, setShouldFetchTheme] = useState(false);
  
  const { data: pagesData, error: pagesError, isLoading: pagesLoading } = useGetPagesQuery(undefined, {
    skip: !shouldFetchPages,
  });

  const { data: themeData, error: themeError, isLoading: themeLoading } = useGetActiveThemeQuery(undefined, {
    skip: !shouldFetchTheme,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<IPage[]>([]);
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const checksCompletedRef = useRef(false);
  const pagesDataRef = useRef(pagesData);
  const pagesErrorRef = useRef(pagesError);
  const pagesLoadingRef = useRef(pagesLoading);
  const themeDataRef = useRef(themeData);
  const themeErrorRef = useRef(themeError);
  const themeLoadingRef = useRef(themeLoading);

  const animateProgress = async (from: number, to: number, isStillLoading: () => boolean) => {
    return new Promise<void>(async resolve => {
      const duration = 800; 
      const start = performance.now();

      const tick = () => {
        const elapsed = performance.now() - start;
        const t = Math.min(elapsed / duration, 1);
        const value = Math.round(from + (to - from) * t);

        setProgress(value);

        if (t < 1 && isStillLoading()) {
          requestAnimationFrame(tick);
        } else {
          setProgress(to);
          resolve();
        }
      };

      tick();
    });
  };

  useEffect(() => {
    pagesDataRef.current = pagesData;
    pagesErrorRef.current = pagesError;
    pagesLoadingRef.current = pagesLoading;
  }, [pagesData, pagesError, pagesLoading]);

  useEffect(() => {
    themeDataRef.current = themeData;
    themeErrorRef.current = themeError;
    themeLoadingRef.current = themeLoading;
  }, [themeData, themeError, themeLoading]);

  useEffect(() => {
    if (checksCompletedRef.current) return;

    const runHealthChecks = async () => {
      const healthChecks: HealthCheck[] = [
        {
          name: 'Server Health',
          check: async () => {
            while (healthLoading) {
              await new Promise(resolve => setTimeout(resolve, 100));
            }

            if (healthError || !health?.success) {
              return {
                success: false,
                error: 'Failed to connect to server. Please ensure the server is running.',
              };
            }

            return { success: true };
          },
        },
        {
          name: 'Fetch Active Theme',
          check: async () => {
            setShouldFetchTheme(true);

            await new Promise(resolve => setTimeout(resolve, 50));

            let attempts = 0;
            const maxAttempts = 100;
            
            while (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 100));
              
              if (!themeLoadingRef.current) break;
              attempts++;
            }

            if (themeDataRef.current) {
              const builtTheme = buildThemeFromData(themeDataRef.current);
              setTheme(builtTheme);
            } else if (themeErrorRef.current) {
              console.warn('Failed to fetch theme, using default:', themeErrorRef.current);
              setTheme(defaultTheme);
            }

            return { success: true };
          },
        },
        {
          name: 'Fetch Pages',
          check: async () => {
            setShouldFetchPages(true);

            await new Promise(resolve => setTimeout(resolve, 50));

            let attempts = 0;
            const maxAttempts = 100;
            
            while (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 100));
              
              if (!pagesLoadingRef.current) break;
              attempts++;
            }

            if (pagesErrorRef.current) {
              return {
                success: false,
                error: 'Failed to fetch pages from the server.',
              };
            }

            if (pagesDataRef.current) {
              setPages(pagesDataRef.current);
              return { success: true };
            }

            return {
              success: false,
              error: 'Failed to fetch pages from the server.',
            };
          },
        },
        {
          name: "Load App Bundle",
          check: async () => {
            await loadBundle();
            return { success: true };
          },
        },
        // Add more checks here in the future
      ];

      const totalSteps = healthChecks.length;

      for (let i = 0; i < totalSteps; i++) {
        const check = healthChecks[i];
        setCurrentStep(i + 1);

        const sliceStart = (i / totalSteps) * 100;
        const sliceEnd = ((i + 1) / totalSteps) * 100;

        try {
          const animPromise = animateProgress(
            sliceStart,
            sliceEnd,
            () => loading 
          );

          const result = await check.check();

          if (!result.success) {
            setError(result.error || `${check.name} failed`);
            setLoading(false);
            setProgress(0);
            checksCompletedRef.current = true;
            return;
          }

          await animPromise;

        } catch (err) {
          setError(`${check.name} encountered an error`);
          setLoading(false);
          setProgress(0);
          checksCompletedRef.current = true;
          return;
        }
      }

      setProgress(100);
      setLoading(false);
      checksCompletedRef.current = true;
    };

    runHealthChecks();
  }, [health, healthError, healthLoading]);

  return { loading, error, pages, theme, progress, currentStep };
};