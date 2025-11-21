import React from 'react';
import { Box, Typography } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import AdminFeatureManagereCrudControls from '../adminFeatureManager/AdminFeatureManagereCrudControls';
import type { PageMapItemProps } from './adminPagesPageTypes';
import { lightenHex } from '../../../../utils/colorUtils';

const PageMapItem: React.FC<PageMapItemProps> = ({
  pageItem,
  theme,
  onSpecialAction,
  onRead,
  onUpdate,
  onDelete
}) => {
  const permissions = pageItem.permissions || {};

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: 80,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 1,
        position: 'relative',
        boxSizing: 'border-box',
        p:2
      }}
    >
      <Box sx={{ position: 'absolute', top: 4, right: 4, zIndex: 2 }}>
        <AdminFeatureManagereCrudControls
          item={pageItem}
          permissions={permissions}
          onSpecialAction={onSpecialAction}
          specialAction={{
            title: "Page Editor",
            icon: <ConstructionIcon fontSize="small" />,
            color: theme?.secondary.main
          }}
          onRead={onRead}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="subtitle1"
          sx={{
            color: theme?.neutral.content,
            textTransform: 'capitalize',
            fontFamily: "SecondaryFont",
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {pageItem.pageName}
          <Typography
            variant="caption"
            sx={{
              color: pageItem.pageActive ? theme?.success.main : theme?.error.main,
              textTransform: 'capitalize',
              fontFamily: "SecondaryFont",
              display: 'flex',
              ml: 1,
            }}
          >
            {pageItem.pageActive ? '(Active)' : '(Inactive)'}
          </Typography>
        </Typography>
        <Typography
            variant="caption"
            sx={{
                color: theme?.neutral.content ? lightenHex(theme.neutral.content, 0.5) : '#888888',
                textTransform: 'lowercase',
                fontFamily: "SecondaryFont",
            }}
        >
            {pageItem.pagePath}
        </Typography>
      </Box>
    </Box>
  );
};

export default PageMapItem;
