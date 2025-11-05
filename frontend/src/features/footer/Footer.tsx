import React from 'react';
import AnimBox from '../../components/pod/AnimBox';
import { useNavigation } from '../../hooks/useNavigate';
import { useAppSelector } from '../../store/hooks';
import type { IPage } from '../page/pageTypes';
import { useGetConfigByKeyQuery } from '../configurations/configurationsApi';
import { Typography, Link as MuiLink } from '@mui/material';

const Footer: React.FC = () => {
  const navigate = useNavigation();
  const activePage = useAppSelector((state) => state.activePage);
  const { data: footerConfig, isLoading } = useGetConfigByKeyQuery('footer');
  const currentYear = new Date().getFullYear();

  if (isLoading || !footerConfig) {
    return (
      <AnimBox
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          minHeight: '150px',
          p: 4,
          bgcolor: 'background.default',
          color: 'text.primary',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <AnimBox
          sx={{
            width: 96,
            height: 16,
            borderRadius: 1,
            bgcolor: 'action.hover',
            animation: 'pulse 1.5s infinite',
          }}
        />
        <AnimBox
          sx={{
            width: 192,
            height: 16,
            borderRadius: 1,
            bgcolor: 'action.hover',
            animation: 'pulse 1.5s infinite',
          }}
        />
      </AnimBox>
    );
  }

  const { copyText, backgroundColor, menuItems = [], auxMenuItems = [] } = footerConfig.data;

  const renderMenuItem = (item: any, index: number) => {
    const isActive =
      item.itemType === 'page' && activePage?.activePageName === item.itemTitle;

    const animationObject = {
      entranceAnimation: item.itemAnimation?.entranceAnimation,
      exitAnimation: item.itemAnimation?.exitAnimation,
      isEntering: true,
      delay: 0.1 * index,
    };

    if (item.itemType === 'page') {
      return (
        <AnimBox
          key={item.itemId}
          animationObject={animationObject}
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
            color: isActive ? 'primary.main' : 'text.primary',
            transition: 'color 0.2s',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          <Typography variant="body2">{item.itemTitle}</Typography>
        </AnimBox>
      );
    }

    if (item.itemType === 'link') {
      return (
        <AnimBox key={item.itemId} animationObject={animationObject}>
          <MuiLink
            href={item.itemPath}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            sx={{
              color: 'text.primary',
              transition: 'color 0.2s',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            <Typography variant="body2">{item.itemTitle}</Typography>
          </MuiLink>
        </AnimBox>
      );
    }

    return null;
  };

  return (
    <AnimBox
      component="footer"
      animationObject={{
        entranceAnimation: footerConfig.data.componentAnimation?.entranceAnimation,
        exitAnimation: footerConfig.data.componentAnimation?.exitAnimation,
        isEntering: true,
      }}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        flexWrap: 'wrap',
        width: '100%',
        minHeight: '150px',
        p: 4,
        bgcolor: backgroundColor || 'background.paper',
        color: 'text.primary',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 -2px 4px rgba(0,0,0,0.15)',
      }}
    >
      <AnimBox sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        {/* Primary menu */}
        <AnimBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
          {menuItems.map(renderMenuItem)}
        </AnimBox>

        <AnimBox sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
          <Typography variant="body2">
            &copy; {currentYear} {copyText}
          </Typography>

          {auxMenuItems.length > 0 && (
            <>
              <Typography sx={{ mx: 1 }} variant="body2">
                |
              </Typography>
              {auxMenuItems.map((item: any, index: number) => (
                <React.Fragment key={item.itemId}>
                  {renderMenuItem(item, index)}
                  {index < auxMenuItems.length - 1 && (
                    <Typography sx={{ mx: 1 }} variant="body2">
                      |
                    </Typography>
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </AnimBox>
      </AnimBox>

      <AnimBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mt: { xs: 4, md: 0 } }}>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Powered by Rkitech
        </Typography>
      </AnimBox>
    </AnimBox>
  );
};

export default Footer;
