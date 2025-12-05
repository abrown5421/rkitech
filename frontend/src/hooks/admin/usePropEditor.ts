import { updateDraft } from "../../features/frontend/renderer/rendererSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export const usePropEditor = () => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.renderer.draftElement);
  const isHoverMode = useAppSelector((state) => state.renderer.hover);
  const deviceMode = useAppSelector((state) => {
    if (state.renderer.mobile) return 'mobile';
    if (state.renderer.tablet) return 'tablet';
    return 'desktop';
  });

  if (!draft) {
    return {
      draft: null,
      isHoverMode: false,
      deviceMode: 'desktop',
      activeProps: {},
      updateProp: () => {},
      updateNestedProp: () => {},
    };
  }

  const baseProps = draft.props ?? {};
  
  let activeProps = baseProps;
  
  if (deviceMode !== 'desktop' && baseProps.responsive?.[deviceMode]) {
    activeProps = {
      ...activeProps,
      ...baseProps.responsive[deviceMode]
    };
  }
  
  if (isHoverMode) {
    activeProps = {
      ...activeProps,
      ...(baseProps.states?.hover ?? {})
    };
  }

  const updateProp = (key: string, value: any) => {
    if (isHoverMode) {
      dispatch(
        updateDraft({
          props: {
            ...baseProps,
            states: {
              ...(baseProps.states ?? {}),
              hover: {
                ...(baseProps.states?.hover ?? {}),
                [key]: value,
              },
            },
          },
        })
      );
    } 
    else if (deviceMode !== 'desktop') {
      dispatch(
        updateDraft({
          props: {
            ...baseProps,
            responsive: {
              ...(baseProps.responsive ?? {}),
              [deviceMode]: {
                ...(baseProps.responsive?.[deviceMode] ?? {}),
                [key]: value,
              },
            },
          },
        })
      );
    } 
    
    else {
      dispatch(
        updateDraft({
          props: {
            ...baseProps,
            [key]: value,
          },
        })
      );
    }
  };

  const updateNestedProp = (path: string[], value: any) => {
    const setNestedValue = (obj: any, path: string[], value: any): any => {
      if (path.length === 1) {
        return { ...obj, [path[0]]: value };
      }
      const [first, ...rest] = path;
      return {
        ...obj,
        [first]: setNestedValue(obj[first] ?? {}, rest, value),
      };
    };

    if (isHoverMode) {
      const updatedHover = setNestedValue(
        baseProps.states?.hover ?? {},
        path,
        value
      );
      dispatch(
        updateDraft({
          props: {
            ...baseProps,
            states: {
              ...(baseProps.states ?? {}),
              hover: updatedHover,
            },
          },
        })
      );
    } else if (deviceMode !== 'desktop') {
      const updatedResponsive = setNestedValue(
        baseProps.responsive?.[deviceMode] ?? {},
        path,
        value
      );
      dispatch(
        updateDraft({
          props: {
            ...baseProps,
            responsive: {
              ...(baseProps.responsive ?? {}),
              [deviceMode]: updatedResponsive,
            },
          },
        })
      );
    } else {
      const updatedProps = setNestedValue(baseProps, path, value);
      dispatch(
        updateDraft({
          props: updatedProps,
        })
      );
    }
  };

  return {
    draft,
    isHoverMode,
    deviceMode,
    activeProps,
    updateProp,
    updateNestedProp,
  };
};