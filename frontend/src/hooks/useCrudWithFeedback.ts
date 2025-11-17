import { openAlert } from "../features/alert/alertSlice";
import { useAppDispatch } from "../store/hooks";


interface UseCrudFeedbackOptions {
  successMessage: string;
  errorMessage?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useCrudWithFeedback = () => {
  const dispatch = useAppDispatch();

  const showAlert = (body: string, severity: 'success' | 'error') => {
    dispatch(openAlert({
      body,
      closeable: true,
      severity,
      orientation: 'bottom-right',
    }));
  };

  const executeWithFeedback = async <T,>(
    mutation: () => Promise<T>,
    options: UseCrudFeedbackOptions
  ): Promise<T | undefined> => {
    try {
      const result = await mutation();
      showAlert(options.successMessage, 'success');
      options.onSuccess?.();
      return result;
    } catch (error) {
      const errorMsg = options.errorMessage || `Operation failed: ${error}`;
      showAlert(errorMsg, 'error');
      options.onError?.(error);
      return undefined;
    }
  };

  return { executeWithFeedback, showAlert };
};