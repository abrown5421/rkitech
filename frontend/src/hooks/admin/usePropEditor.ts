import { updateDraft } from "../../features/frontend/renderer/rendererSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export const usePropEditor = () => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.renderer.draftElement);
  const isHoverMode = useAppSelector((state) => state.renderer.hover);

  if (!draft) {
    return {
      draft: null,
      isHoverMode: false,
      activeProps: {},
      updateProp: () => {},
      updateNestedProp: () => {},
    };
  }

  const typographyProps = draft.props ?? {};
  
  const activeProps = isHoverMode 
    ? (typographyProps.states?.hover ?? {})
    : typographyProps;

  const updateProp = (key: string, value: any) => {
    if (isHoverMode) {
      dispatch(
        updateDraft({
          props: {
            ...typographyProps,
            states: {
              ...(typographyProps.states ?? {}),
              hover: {
                ...(typographyProps.states?.hover ?? {}),
                [key]: value,
              },
            },
          },
        })
      );
    } else {
      dispatch(
        updateDraft({
          props: {
            ...typographyProps,
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
        typographyProps.states?.hover ?? {},
        path,
        value
      );
      dispatch(
        updateDraft({
          props: {
            ...typographyProps,
            states: {
              ...(typographyProps.states ?? {}),
              hover: updatedHover,
            },
          },
        })
      );
    } else {
      const updatedProps = setNestedValue(typographyProps, path, value);
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
    activeProps,
    updateProp,
    updateNestedProp,
  };
};