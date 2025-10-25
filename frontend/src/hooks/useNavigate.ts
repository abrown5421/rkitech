import { useDispatch } from 'react-redux';
import { useNavigate as useRouterNavigate } from 'react-router-dom';
import { useCallback, useRef } from 'react';
import { setActivePageAnimateIn, setActivePageName } from '../features/page/activePageSlice';

export const useNavigate = (animationDuration: number = 500) => {
  const dispatch = useDispatch();
  const routerNavigate = useRouterNavigate();
  const isAnimating = useRef(false); 

  const navigateToPage = useCallback(
    (newPageName: string, newPagePath: string) => {
      if (isAnimating.current) return; 
      isAnimating.current = true;

      dispatch(setActivePageAnimateIn(false));

      setTimeout(() => {
        dispatch(setActivePageName(newPageName));
        routerNavigate(newPagePath);
        dispatch(setActivePageAnimateIn(true));
        setTimeout(() => {
          isAnimating.current = false;
        }, animationDuration);
      }, animationDuration);
    },
    [dispatch, routerNavigate, animationDuration]
  );

  return navigateToPage;
};
