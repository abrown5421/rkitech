import React from 'react';
import { useGetActiveThemeQuery } from '../../../theme/themeApi';
import AnimBox from '../../../../components/animBox/AnimBox';
import { useAppSelector } from '../../../../store/hooks';

const Dashboard: React.FC = () => {
  const activePage = useAppSelector((state) => state.activePage);
  const { data: theme } = useGetActiveThemeQuery();
  
  return (
    <AnimBox
      animationObject={{
          entranceAnimation: 'animate__fadeIn',
          exitAnimation: 'animate__fadeOut',
          isEntering: activePage.activePageAnimateIn,
      }}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
        backgroundColor: theme?.neutral.main,
        zIndex: 2,
        boxSizing: 'border-box',
        p: 2
      }}
    >
      Dashboard
    </AnimBox>
  );
};

export default Dashboard;
