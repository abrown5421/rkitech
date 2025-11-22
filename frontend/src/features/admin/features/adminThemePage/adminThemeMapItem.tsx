import React from 'react';
import { Box, Typography } from "@mui/material";
import { COLOR_KEYS, type ThemeCardProps } from "./adminThemePageTypes";
import AdminFeatureManagereCrudControls from "../adminFeatureManager/AdminFeatureManagereCrudControls";

const ThemeMapItem: React.FC<ThemeCardProps> = ({
  themeItem,
  onRead,
  onUpdate,
  onDelete,
}) => {
  const permissions = themeItem.permissions || {};

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "calc(20% - 16px)",
        minWidth: 150,
        height: 80,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 1,
        position: "relative",
        border: themeItem.active
          ? `2px solid ${themeItem.accent.main}`
          : "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          zIndex: 2,
        }}
      >
        <AdminFeatureManagereCrudControls
          item={themeItem}
          permissions={permissions}
          onRead={onRead}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", width: "25%" }}>
        <Box sx={{ flex: 1, backgroundColor: themeItem.neutral2.main }} />
        <Box sx={{ flex: 1, backgroundColor: themeItem.neutral3.main }} />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          backgroundColor: themeItem.neutral.main,
          p: 1.2,
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: themeItem.neutral.content,
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          {themeItem.name}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}>
          {COLOR_KEYS.map((key) => {
            const color = (themeItem as any)[key];
            return (
              <Box
                key={key}
                sx={{
                  width: "16%",
                  height: 24,
                  borderRadius: "4px",
                  backgroundColor: color.main,
                  color: color.content,
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                A
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default ThemeMapItem;
