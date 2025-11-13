import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, TextField, Button, Chip, Divider } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { Add } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { 
  useGetThemesQuery, 
  useChangeActiveThemeMutation, 
  useGetActiveThemeQuery, 
  useUpdateThemeMutation, 
  useDeleteThemeMutation, 
  useCreateThemeMutation 
} from "../../../theme/themeApi";
import type { ITheme } from "../../../theme/themeTypes";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { openAlert } from "../../../alert/alertSlice";
import { useNavigation } from "../../../../hooks/useNavigate";
import type { IPage } from "../../../page/pageTypes";
import ColorPicker from "../../../../components/colorPicker/ColorPicker";

const COLOR_KEYS = ["primary", "secondary", "accent", "success", "warning", "error"] as const;
const ALL_COLOR_KEYS = [...COLOR_KEYS, "neutral", "neutral2", "neutral3"] as const;

const DEFAULT_THEME: Partial<ITheme> = {
  name: "New Theme",
  primary: { main: "#1976d2", content: "#ffffff" },
  secondary: { main: "#dc004e", content: "#ffffff" },
  accent: { main: "#f50057", content: "#ffffff" },
  success: { main: "#4caf50", content: "#ffffff" },
  warning: { main: "#ff9800", content: "#000000" },
  error: { main: "#f44336", content: "#ffffff" },
  neutral: { main: "#ffffff", content: "#000000" },
  neutral2: { main: "#f5f5f5", content: "#000000" },
  neutral3: { main: "#e0e0e0", content: "#000000" },
};

type ColorKey = typeof ALL_COLOR_KEYS[number];

interface ThemePreviewProps {
  theme: ITheme | Partial<ITheme>;
  activeTheme?: ITheme;
  isActive?: boolean;
  onActivate?: () => void;
  isLoading?: boolean;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ 
  theme, 
  activeTheme, 
  isActive, 
  onActivate, 
  isLoading 
}) => (
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
    {isActive !== undefined && (
      <Chip
        label={isActive ? "Active" : "Activate"}
        variant={isActive ? "filled" : "outlined"}
        clickable={!isActive}
        onClick={() => !isActive && onActivate?.()}
        sx={{
          position: 'absolute',
          top: 5,
          right: 5,
          backgroundColor: isActive ? activeTheme?.success.main : "transparent",
          color: isActive ? activeTheme?.success.content : activeTheme?.neutral3.main,
          borderColor: isActive ? activeTheme?.success.content : activeTheme?.neutral3.main,
        }}
      />
    )}
    
    <Box sx={{ display: "flex", flexDirection: "column", width: "25%" }}>
      <Box sx={{ flex: 1, backgroundColor: theme.neutral2?.main }} />
      <Box sx={{ flex: 1, backgroundColor: theme.neutral3?.main }} />
    </Box>

    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        backgroundColor: theme.neutral?.main,
        p: 1.2,
        justifyContent: "space-between",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: theme.neutral?.content,
          fontWeight: 600,
          textTransform: "capitalize",
        }}
      >
        {theme.name}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}>
        {COLOR_KEYS.map((key) => {
          const color = (theme as any)[key];
          return (
            <Box
              key={key}
              sx={{
                width: "16%",
                height: 24,
                borderRadius: "4px",
                backgroundColor: color?.main,
                color: color?.content,
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

interface ColorGroupEditorProps {
  colorKey: ColorKey;
  colorGroup: { main: string; content: string };
  onChange: (key: ColorKey, type: 'main' | 'content', value: string) => void;
  activeTheme?: ITheme;
}

const ColorGroupEditor: React.FC<ColorGroupEditorProps> = ({ 
  colorKey, 
  colorGroup, 
  onChange, 
  activeTheme 
}) => {
  const inputSx = {
    border: `1px solid ${activeTheme?.neutral.content}`,
    '& .MuiInputBase-input': { color: activeTheme?.neutral.content },
    '& .MuiInputLabel-root': {
      color: activeTheme?.neutral.content,
      backgroundColor: activeTheme?.neutral.main,
    },
  };

  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        border: `1px solid ${activeTheme?.neutral.content}`, 
        p: 2, 
        borderRadius: '5px' 
      }}
    >
      <Typography sx={{ width: 100, textTransform: "capitalize", mb: 2 }}>
        {colorKey}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center" }}>
        <ColorPicker
          color={colorGroup.main}
          onChange={(newColor) => onChange(colorKey, 'main', newColor)}
          sx={{ flex: 1 }}
          inputSx={inputSx}
        />
        <ColorPicker
          color={colorGroup.content}
          onChange={(newColor) => onChange(colorKey, 'content', newColor)}
          sx={{ flex: 1 }}
          inputSx={inputSx}
        />
      </Box>
    </Box>
  );
};

interface ThemeEditorProps {
  theme: ITheme | Partial<ITheme>;
  originalTheme?: ITheme;
  activeTheme?: ITheme;
  isNew: boolean;
  onSave: () => void;
  onDelete?: () => void;
  onRevert?: () => void;
  onChange: (theme: ITheme | Partial<ITheme>) => void;
  onActivate?: () => void;
  isSaving?: boolean;
  isDeleting?: boolean;
}

const ThemeEditor: React.FC<ThemeEditorProps> = ({
  theme,
  originalTheme,
  activeTheme,
  isNew,
  onSave,
  onDelete,
  onRevert,
  onChange,
  onActivate,
  isSaving,
  isDeleting,
}) => {
  const isChanged = JSON.stringify(theme) !== JSON.stringify(originalTheme);
  const isActive = !isNew && theme._id === activeTheme?._id;

  const handleColorChange = (key: ColorKey, type: 'main' | 'content', value: string) => {
    onChange({
      ...theme,
      [key]: {
        ...(theme as any)[key],
        [type]: value,
      },
    });
  };

  const inputSx = {
    border: `1px solid ${activeTheme?.neutral.content}`,
    '& .MuiInputBase-input': { color: activeTheme?.neutral.content },
    '& .MuiInputLabel-root': {
      color: activeTheme?.neutral.content,
      backgroundColor: activeTheme?.neutral.main,
    },
  };

  return (
    <Box sx={{ p: 4, display: "flex", flexDirection: "column", height: "100%", overflow: 'scroll' }}>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 4, mb: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", flex: 9 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {isNew ? 'New Theme Editor' : `Editing ${theme.name} Theme`}
          </Typography>
          {isNew ? (
            <Typography variant="body1" sx={{ mb: 2 }}>
              A theme in our system is built from nine color pairs primary, secondary, accent, 
              success, warning, error, neutral, neutral2, and neutral3. Each color pair contains 
              a main and a contrasting content color to promote readability.
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ mb: 2 }}>
              Theme ID: <strong>{theme._id}</strong>
            </Typography>
          )}
          <TextField
            fullWidth
            size="small"
            label="Theme Name"
            variant="outlined"
            value={theme?.name || ""}
            onChange={(e) => onChange({ ...theme, name: e.target.value })}
            sx={inputSx}
          />
        </Box>
        
        <Box sx={{ display: "flex", flexDirection: "column", flex: 3 }}>
          <ThemePreview 
            theme={theme} 
            activeTheme={activeTheme}
            isActive={isActive}
            onActivate={onActivate}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mb: 4 }}>
        {ALL_COLOR_KEYS.map((key) => {
          const colorGroup = (theme as any)[key];
          if (!colorGroup) return null;
          
          return (
            <ColorGroupEditor
              key={key}
              colorKey={key}
              colorGroup={colorGroup}
              onChange={handleColorChange}
              activeTheme={activeTheme}
            />
          );
        })}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {!isNew && (
          <Button
            disabled={isDeleting}
            onClick={onDelete}
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
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, ml: 'auto' }}>
          {!isNew && (
            <Button
              onClick={onRevert}
              sx={{
                backgroundColor: isChanged ? activeTheme?.secondary.main : '#ccc',
                color: isChanged ? activeTheme?.secondary.content : '#fff',
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
          )}
          
          <Button
            disabled={(!isNew && !isChanged) || isSaving}
            onClick={onSave}
            sx={{
              backgroundColor: (isNew || isChanged) ? activeTheme?.primary.main : '#ccc',
              color: (isNew || isChanged) ? activeTheme?.primary.content : '#fff',
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
};

interface ThemeCardProps {
  theme: ITheme;
  activeTheme?: ITheme;
  isLoading?: boolean;
  onActivate: () => void;
  onEdit: () => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ 
  theme, 
  activeTheme, 
  isLoading, 
  onActivate, 
  onEdit 
}) => (
  <Box
    onClick={onActivate}
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
        onEdit();
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
        {COLOR_KEYS.map((key) => {
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
);

const AdminThemePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigation();
  const location = useLocation();
  const activePage = useAppSelector((state) => state.activePage);

  const { data: themes } = useGetThemesQuery();
  const { data: activeTheme } = useGetActiveThemeQuery();
  
  const [changeActiveTheme, { isLoading }] = useChangeActiveThemeMutation();
  const [createTheme] = useCreateThemeMutation();
  const [updateTheme, { isLoading: isUpdating }] = useUpdateThemeMutation();
  const [deleteTheme, { isLoading: isDeleting }] = useDeleteThemeMutation();

  const searchParams = new URLSearchParams(location.search);
  const themeId = searchParams.get("id");
  const action = searchParams.get("action");
  
  const thisTheme = themes?.find((t) => t._id === themeId);
  const [editableTheme, setEditableTheme] = useState<ITheme | undefined>(thisTheme);
  const [newTheme, setNewTheme] = useState<Partial<ITheme>>(DEFAULT_THEME);

  useEffect(() => {
    setEditableTheme(thisTheme);
  }, [thisTheme]);

  const showAlert = (body: string, severity: 'success' | 'error') => {
    dispatch(openAlert({
      body,
      closeable: true,
      severity,
      orientation: "bottom-right",
    }));
  };

  const navigateToPath = (path: string) => {
    if (!activePage.activePageObj) return;
    navigate({
      ...activePage.activePageObj,
      pagePath: path,
    } as IPage, true);
  };

  const handleThemeActivate = async (theme: ITheme) => {
    try {
      await changeActiveTheme(theme._id ?? "").unwrap();
    } catch (error) {
      showAlert(`Failed to change theme: ${error}`, 'error');
    }
  };

  const handleThemeSave = async (type: 'new' | 'existing') => {
    if (type === 'existing' && (!editableTheme || !themeId)) return;

    try {
      if (type === 'new') {
        await createTheme(newTheme).unwrap();
      } else {
        await updateTheme({ id: themeId!, data: editableTheme! }).unwrap();
      }
      showAlert('The theme was saved successfully', 'success');
    } catch (error) {
      showAlert(`Failed to save theme: ${error}`, 'error');
    }
  };

  const handleThemeDelete = async () => {
    if (!themeId || !window.confirm("Are you sure you want to delete this theme?")) return;

    try {
      await deleteTheme(themeId).unwrap();
      showAlert("Theme deleted successfully", 'success');
      navigateToPath('/admin/theme');
    } catch (error) {
      showAlert(`Failed to delete theme: ${error}`, 'error');
    }
  };

  if (action === "new" || (themeId && editableTheme)) {
    const isNew = action === "new";
    const theme = isNew ? newTheme : editableTheme!;
    
    return (
      <ThemeEditor
        theme={theme}
        originalTheme={isNew ? undefined : thisTheme}
        activeTheme={activeTheme}
        isNew={isNew}
        onSave={() => handleThemeSave(isNew ? 'new' : 'existing')}
        onDelete={!isNew ? handleThemeDelete : undefined}
        onRevert={!isNew ? () => setEditableTheme(thisTheme) : undefined}
        onChange={isNew 
          ? (theme) => setNewTheme(theme) 
          : (theme) => setEditableTheme(theme as ITheme)}
        onActivate={!isNew ? () => handleThemeActivate(editableTheme!) : undefined}
        isSaving={isUpdating}
        isDeleting={isDeleting}
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: "column", p: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontFamily: 'PrimaryFont' }}>
          Theme Manager
        </Typography>
        <Button
          startIcon={<Add />}
          onClick={() => navigateToPath(`${activePage.activePageObj?.pagePath}?action=new`)}
          sx={{
            backgroundColor: activeTheme?.primary.main,
            color: activeTheme?.primary.content,
            border: '1px solid transparent',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: activeTheme?.neutral.main,
              color: activeTheme?.primary.main,
              borderColor: activeTheme?.primary.main,
            },
          }}
        >
          Add New Theme
        </Button>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 2,
          boxSizing: "border-box",
        }}
      >
        {themes
          ?.slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((theme: ITheme) => (
            <ThemeCard
              key={theme._id || theme.name}
              theme={theme}
              activeTheme={activeTheme}
              isLoading={isLoading}
              onActivate={() => handleThemeActivate(theme)}
              onEdit={() => navigateToPath(`${activePage.activePageObj?.pagePath}?id=${theme._id}`)}
            />
          ))}
      </Box>
    </Box>
  );
};

export default AdminThemePage;