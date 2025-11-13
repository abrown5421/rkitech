import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useGetThemesQuery, useChangeActiveThemeMutation, useGetActiveThemeQuery } from "../../../theme/themeApi";
import type { ITheme } from "../../../theme/themeTypes";
import { useAppDispatch } from "../../../../store/hooks";
import { openAlert } from "../../../alert/alertSlice";
import { openModal } from "../../../modal/modalSlice";

const AdminThemePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: themes } = useGetThemesQuery();
  const { data: activeTheme } = useGetActiveThemeQuery();
  const [changeActiveTheme, { isLoading }] = useChangeActiveThemeMutation();

  const handleThemeClick = async (theme: ITheme) => {
    try {
      await changeActiveTheme(theme._id ?? "").unwrap();
    } catch (error) {
      dispatch(
        openAlert({
          body: `Failed to change theme: ${error}`,
          closeable: true,
          severity: 'error',
          orientation: 'bottom-right'
        })
      );
    }
  };

  const editThemeClick = (theme: ITheme) => {
    dispatch(openModal({
      open: true,
      closeable: true,
      title: `Now Editing the ${theme.name} theme.`,
      entrance: undefined,
      exit: undefined,
      children: [],
      backgroundColor: activeTheme?.neutral.main ?? "#fff"
    }));
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)", 
        gap: 2,
        p: 4,
        boxSizing: "border-box",
      }}
    >
      {themes
        ?.slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((theme: ITheme) => (
          <Box
            key={theme._id || theme.name}
            onClick={() => handleThemeClick(theme)}
            sx={{
              display: "flex",
              flexDirection: "row",
              height: 80,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 1,
              cursor: "pointer",
              position: "relative", 
              border: theme.active
                ? `2px solid ${theme.accent.main}`
                : "1px solid rgba(0,0,0,0.1)",
              opacity: isLoading ? 0.6 : 1,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow: 3,
              },
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation(); 
                editThemeClick(theme);
              }}
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                zIndex: 2,
                color: activeTheme?.primary.main,
                border: '1px solid transparent',
                "&:hover": { borderColor: activeTheme?.primary.main },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            <Box sx={{ display: "flex", flexDirection: "column", width: "25%" }}>
              <Box sx={{ flex: 1, backgroundColor: theme.neutral2.main }} />
              <Box sx={{ flex: 1, backgroundColor: theme.neutral3.main }} />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                backgroundColor: theme.neutral.main,
                p: 1.2,
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: theme.neutral.content,
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                {theme.name}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}>
                {["primary", "secondary", "accent", "success", "warning", "error"].map(
                  (key) => {
                    const color = (theme as any)[key];
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
                  }
                )}
              </Box>
            </Box>
          </Box>
      ))}
    </Box>
  );
};

export default AdminThemePage;
