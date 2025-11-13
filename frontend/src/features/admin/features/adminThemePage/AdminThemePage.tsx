import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, TextField, Button, Chip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useLocation } from "react-router-dom";
import { useGetThemesQuery, useChangeActiveThemeMutation, useGetActiveThemeQuery, useUpdateThemeMutation, useDeleteThemeMutation } from "../../../theme/themeApi";
import type { ITheme } from "../../../theme/themeTypes";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { openAlert } from "../../../alert/alertSlice";
import { useNavigation } from "../../../../hooks/useNavigate";
import type { IPage } from "../../../page/pageTypes";
import ColorPicker from "../../../../components/colorPicker/ColorPicker";

const AdminThemePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigation();
  const { data: themes } = useGetThemesQuery();
  const { data: activeTheme } = useGetActiveThemeQuery();
  
  const [changeActiveTheme, { isLoading }] = useChangeActiveThemeMutation();
  const [updateTheme, { isLoading: isUpdating }] = useUpdateThemeMutation();
  const [deleteTheme, { isLoading: isDeleting }] = useDeleteThemeMutation();

  const activePage = useAppSelector((state) => state.activePage);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const themeId = searchParams.get("id");
  const thisTheme = themes?.find((t) => t._id === themeId)

  const [editableTheme, setEditableTheme] = useState<ITheme | undefined>(thisTheme);
  
  useEffect(()=>{
    setEditableTheme(thisTheme);
  }, [thisTheme])

  const isThemeChanged = (): boolean => {
    return JSON.stringify(editableTheme) !== JSON.stringify(thisTheme);
  };

  const handleThemeClick = async (theme: ITheme) => {
    try {
      await changeActiveTheme(theme._id ?? "").unwrap();
    } catch (error) {
      dispatch(
        openAlert({
          body: `Failed to change theme: ${error}`,
          closeable: true,
          severity: "error",
          orientation: "bottom-right",
        })
      );
    }
  };

  const editThemeClick = (theme: ITheme) => {
    if (!activePage.activePageObj) return;

    const updatedActivePageObj = {
      ...activePage.activePageObj,
      pagePath: `${activePage.activePageObj.pagePath}?id=${theme._id}`,
    };

    navigate(updatedActivePageObj as IPage, true);
  };

  const handleThemeSave = async () => {
    if (!editableTheme || !themeId) return;

    try {
      await updateTheme({ id: themeId, data: editableTheme }).unwrap();
      dispatch(
        openAlert({
          body: 'The theme was saved successfully',
          closeable: true,
          severity: 'success',
          orientation: 'bottom-right',
        })
      );
    } catch (error) {
      dispatch(
        openAlert({
          body: `Failed to save theme: ${error}`,
          closeable: true,
          severity: 'error',
          orientation: 'bottom-right',
        })
      );
    }
  }

  const handleThemeRevert = () => {
    setEditableTheme(thisTheme)
  }

  const handleThemeDelete = async () => {
    if (!themeId) return;

    if (!window.confirm("Are you sure you want to delete this theme?")) return;

    try {
      await deleteTheme(themeId).unwrap();
      dispatch(
        openAlert({
          body: "Theme deleted successfully",
          closeable: true,
          severity: "success",
          orientation: "bottom-right",
        })
      );
      
      if (!activePage.activePageObj) return;

      const updatedActivePageObj = {
        ...activePage.activePageObj,
        pagePath: '/admin/theme',
      };

      navigate(updatedActivePageObj as IPage, true);
    } catch (error) {
      dispatch(
        openAlert({
          body: `Failed to delete theme: ${error}`,
          closeable: true,
          severity: "error",
          orientation: "bottom-right",
        })
      );
    }
  };

  if (themeId && editableTheme) {
    return (
      <Box sx={{ p: 4, display: "flex", flexDirection: "column", height: "100%", overflow: 'scroll' }}>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 4, mb: 4}}>
          <Box sx={{ display: "flex", flexDirection: "column", flex: 9 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Editing {editableTheme.name} Theme
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Theme ID: <strong>{themeId}</strong>
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Theme Name"
              variant="outlined"
              value={editableTheme?.name || ""}
              onChange={(e) =>
                setEditableTheme({ ...editableTheme, name: e.target.value })
              }
              sx={{
                border: `1px solid ${activeTheme?.neutral.content}`,
                '& .MuiInputBase-input': {
                  color: activeTheme?.neutral.content, 
                },
                '& .MuiInputLabel-root': {
                  color: activeTheme?.neutral.content,
                  backgroundColor: activeTheme?.neutral.main,
                },
              }}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", flex: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                height: '100%',
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 1,
                position: "relative",
                opacity: isLoading ? 0.6 : 1,
                transition: "all 0.2s ease-in-out",
                border: `1px solid ${activeTheme?.neutral.content}`
              }}
            >
              <Chip
                label={editableTheme._id === activeTheme?._id ? "Active" : "Activate"}
                variant={editableTheme._id === activeTheme?._id ? "filled" : "outlined"}
                clickable={editableTheme._id !== activeTheme?._id}
                onClick={() => editableTheme._id !== activeTheme?._id && handleThemeClick(editableTheme)}
                sx={{
                  position: 'absolute', 
                  top: 5, 
                  right: 5,
                  backgroundColor: editableTheme._id === activeTheme?._id ? activeTheme?.success.main : "transparent",
                  color: editableTheme._id === activeTheme?._id ? activeTheme?.success.content : activeTheme?.neutral3.main,
                  borderColor: editableTheme._id === activeTheme?._id ? `1px solid ${activeTheme?.success.content}` : `1px solid ${activeTheme?.neutral3.main}`,
                }}
              />
              <Box sx={{ display: "flex", flexDirection: "column", width: "25%" }}>
                <Box sx={{ flex: 1, backgroundColor: editableTheme.neutral2.main }} />
                <Box sx={{ flex: 1, backgroundColor: editableTheme.neutral3.main }} />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  backgroundColor: editableTheme.neutral.main,
                  p: 1.2,
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: editableTheme.neutral.content,
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {editableTheme.name}
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}>
                  {["primary", "secondary", "accent", "success", "warning", "error"].map((key) => {
                    const color = (editableTheme as any)[key];
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
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mb: 4 }}>
          {["primary", "secondary", "accent", "success", "warning", "error", "neutral", "neutral2", "neutral3"].map((key) => {
            const colorGroup = (editableTheme as any)[key];
            if (!colorGroup) return null;

            return (
              <Box key={key} sx={{ display: "flex", flexDirection: "column", border: `1px solid ${activeTheme?.neutral.content}`, p: 2, borderRadius: '5px' }}>
                <Typography sx={{ width: 100, textTransform: "capitalize", mb: 2 }}>{key}</Typography>
                <Box key={key} sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center" }}>
                  <ColorPicker
                    color={colorGroup.main}
                    onChange={(newColor) => {
                      setEditableTheme({
                        ...editableTheme,
                        [key]: {
                          ...colorGroup,
                          main: newColor,
                        },
                      });
                    }}
                    sx={{flex: 1}}
                    inputSx={{
                      border: `1px solid ${activeTheme?.neutral.content}`,
                      '& .MuiInputBase-input': {
                        color: activeTheme?.neutral.content, 
                      },
                      '& .MuiInputLabel-root': {
                        color: activeTheme?.neutral.content,
                        backgroundColor: activeTheme?.neutral.main,
                      },
                    }}
                  />

                  <ColorPicker
                    color={colorGroup.content}
                    onChange={(newColor) => {
                      setEditableTheme({
                        ...editableTheme,
                        [key]: {
                          ...colorGroup,
                          content: newColor,
                        },
                      });
                    }}
                    sx={{flex: 1}}
                    inputSx={{
                      border: `1px solid ${activeTheme?.neutral.content}`,
                      '& .MuiInputBase-input': {
                        color: activeTheme?.neutral.content, 
                      },
                      '& .MuiInputLabel-root': {
                        color: activeTheme?.neutral.content,
                        backgroundColor: activeTheme?.neutral.main,
                      },
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
              disabled={isDeleting}
              onClick={handleThemeDelete}
              sx={{
                backgroundColor: !isDeleting ? activeTheme?.error.main : activeTheme?.neutral.main,
                color: !isDeleting ? activeTheme?.error.content : activeTheme?.neutral.content,
                border: '1px solid transparent',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: activeTheme?.neutral.main,
                  color: activeTheme?.error.main,
                  borderColor: activeTheme?.error.main,
                },
              }}
            >
              Delete Theme
            </Button>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2}}>
            <Button
              onClick={handleThemeRevert}
              sx={{
                backgroundColor: isThemeChanged() ? activeTheme?.secondary.main : '#ccc',
                color: isThemeChanged() ? activeTheme?.secondary.content : '#fff',
                border: '1px solid transparent',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: activeTheme?.neutral.main,
                  color: activeTheme?.secondary.main,
                  borderColor: activeTheme?.secondary.main,
                },
              }}
            >
              Revert Theme
            </Button>
            <Button
              disabled={!isThemeChanged() || isUpdating}
              onClick={handleThemeSave}
              sx={{
                backgroundColor: isThemeChanged() ? activeTheme?.primary.main : '#ccc',
                color: isThemeChanged() ? activeTheme?.primary.content : '#fff',
                border: '1px solid transparent',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: activeTheme?.neutral.main,
                  color: activeTheme?.primary.main,
                  borderColor: activeTheme?.primary.main,
                },
              }}
            >
              Save Theme
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

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
                border: "1px solid transparent",
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
                {["primary", "secondary", "accent", "success", "warning", "error"].map((key) => {
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
                })}
              </Box>
            </Box>
          </Box>
        ))}
    </Box>
  );
};

export default AdminThemePage;
