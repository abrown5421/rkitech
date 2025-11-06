import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Skeleton,
  Link as MuiLink,
} from '@mui/material';
import AnimBox from '../../components/animBox/AnimBox';
import { useNavigation } from '../../hooks/useNavigate';
import type { IPage } from '../page/pageTypes';
import type { NavbarProps } from './navbarTypes';
import { useAppSelector } from '../../store/hooks';
import { useGetActiveThemeQuery } from '../theme/themeApi';
import { useThemeValue } from '../../hooks/useThemeValue';

const Navbar: React.FC<NavbarProps> = ({ configs, loading }) => {
  const navigate = useNavigation();
  const { data: theme } = useGetActiveThemeQuery();
  const activePage = useAppSelector((state) => state.activePage);
  const navbarConfig = configs.find((c) => c.key === 'navbar');
  
  if (loading || !navbarConfig) {
    return (
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 2, height: 64 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Skeleton variant="circular" width={48} height={48} />
            <Skeleton variant="text" width={100} height={24} />
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} variant="text" width={80} height={24} />
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    );
  }
  
  const { data } = navbarConfig;
  
  return (
    <AnimBox
      position="static"
      color="transparent"
      animationObject={{
        entranceAnimation: data.componentAnimation?.entranceAnimation,
        exitAnimation: data.componentAnimation?.exitAnimation,
        isEntering: true,
      }}
      sx={{
        bgcolor: useThemeValue(data.backgroundColor) || 'neutral',
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
        justifyContent: 'space-between',
        height: 64,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <AnimBox
          animationObject={{
            entranceAnimation: data.logoAnimation?.entranceAnimation,
            exitAnimation: data.logoAnimation?.exitAnimation,
            isEntering: true,
          }}
          display="flex"
          alignItems="center"
        >
          <AnimBox display="flex" flexDirection="column" mr={1}>
            <Box
              component="img"
              src={data.logo}
              alt="Logo"
              sx={{
                height: '100%',
                maxHeight: 48,
                objectFit: 'contain',
              }}
            />
          </AnimBox>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'PrimaryFont',
              color: theme?.primary?.main,
            }}
          >
            {data.logoTitle}
          </Typography>
        </AnimBox>

        <Box display="flex" alignItems="center" gap={3} fontFamily="SecondaryFont" >
          {data.menuItems?.map((item: any, index: number) => {
            const isActive =
              item.itemType === 'page' &&
              activePage?.activePageName === item.itemTitle;

            const commonAnimation = {
              entranceAnimation: item.itemAnimation?.entranceAnimation,
              exitAnimation: item.itemAnimation?.exitAnimation,
              isEntering: true,
              delay: 0.25 * index,
            };

            if (item.itemType === 'page') {
              return (
                <AnimBox
                  key={item.itemId}
                  animationObject={commonAnimation}
                  onClick={() => {
                    if (!isActive) {
                      navigate({
                        pageName: item.itemTitle,
                        pagePath: item.itemPath,
                      } as IPage);
                    }
                  }}
                  sx={{
                    cursor: 'pointer',
                    color: isActive ? theme?.primary?.main || '#FE9A00' : theme?.neutral?.content || '#1A1D27',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: isActive ? theme?.accent.main : theme?.primary?.main },
                  }}
                >
                  <Typography variant="body1">{item.itemTitle}</Typography>
                </AnimBox>
              );
            }

            if (item.itemType === 'link') {
              return (
                <AnimBox
                  key={item.itemId}
                  animationObject={commonAnimation}
                  sx={{ cursor: 'pointer' }}
                >
                  <MuiLink
                    href={item.itemPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="none"
                    sx={{
                      color: theme?.neutral?.content || '#1A1D27',
                      transition: 'color 0.2s ease',
                      '&:hover': { color: theme?.primary?.main },
                    }}
                  >
                    {item.itemTitle}
                  </MuiLink>
                </AnimBox>
              );
            }

            return null;
          })}
        </Box>
      </Toolbar>
    </AnimBox>
  );
};

export default Navbar;
