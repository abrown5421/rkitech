import { useEffect, useState, useRef } from 'react';
import { useGetHealthQuery } from '../features/frontend/health/healthApi';
import { useGetPagesQuery } from '../features/frontend/page/pageApi';
import type { IPage } from '../features/frontend/page/pageTypes';

interface HealthCheck {
  name: string;
  check: () => Promise<{ success: boolean; error?: string }>;
}

export const useCheckHealth = () => {
  const { data: health, error: healthError, isLoading: healthLoading } = useGetHealthQuery();
  const [shouldFetchPages, setShouldFetchPages] = useState(false);
  const { data: pagesData, error: pagesError, isLoading: pagesLoading } = useGetPagesQuery(undefined, {
    skip: !shouldFetchPages,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<IPage[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const checksCompletedRef = useRef(false);
  const pagesDataRef = useRef(pagesData);
  const pagesErrorRef = useRef(pagesError);
  const pagesLoadingRef = useRef(pagesLoading);

  useEffect(() => {
    pagesDataRef.current = pagesData;
    pagesErrorRef.current = pagesError;
    pagesLoadingRef.current = pagesLoading;
  }, [pagesData, pagesError, pagesLoading]);

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
        // Add more checks here in the future
      ];

      const totalSteps = healthChecks.length;
      const progressPerStep = 100 / totalSteps;

      for (let i = 0; i < healthChecks.length; i++) {
        const check = healthChecks[i];
        setCurrentStep(i + 1);

        try {
          const result = await check.check();

          if (!result.success) {
            setError(result.error || `${check.name} failed`);
            setLoading(false);
            setProgress(0);
            checksCompletedRef.current = true;
            return;
          }

          const newProgress = Math.round((i + 1) * progressPerStep);
          setProgress(newProgress);

        } catch (err) {
          setError(`${check.name} encountered an error: ${err instanceof Error ? err.message : 'Unknown error'}`);
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

  return { loading, error, pages, progress, currentStep };
};