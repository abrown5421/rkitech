import React from "react";
import {
  Box,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel
} from "@mui/material";
import type { ActionConfigParameter } from "../../frontend/actions/actionTypes";
import { getAllActions } from "../../frontend/actions/actionRegistry";
import { useGetNonAdminPagesQuery } from "../../frontend/page/pageApi";
import type { ActionPickerProps } from "./actionPickerTypes";

export const ActionPicker: React.FC<ActionPickerProps> = ({ value, onChange }) => {
  const actions = getAllActions();
  const { data: pages } = useGetNonAdminPagesQuery();

  const [selectedActionType, setSelectedActionType] = React.useState<string>(value?.type || "");
  const [params, setParams] = React.useState<Record<string, any>>(value || {});

  const handleActionSelect = (type: string) => {
    setSelectedActionType(type);
    const actionDef = actions.find((a) => a.config.type === type);
    if (!actionDef) return;

    const initialParams: Record<string, any> = {};
    actionDef.config.parameters.forEach((p) => {
      if (p.type === "boolean") initialParams[p.name] = true;
      else initialParams[p.name] = "";
    });

    setParams(initialParams);
    onChange({ type, ...initialParams });
  };

  const handleParamChange = (name: string, value: any) => {
    const newParams = { ...params, [name]: value };
    setParams(newParams);
    onChange({ type: selectedActionType, ...newParams });
  };

  const selectedAction = actions.find((a) => a.config.type === selectedActionType);

  const renderParameterField = (param: ActionConfigParameter) => {
    switch (param.type) {
      case "text":
        return (
          <TextField
            key={param.name}
            label={param.label}
            value={params[param.name] || ""}
            onChange={(e) => handleParamChange(param.name, e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />
        );
      case "number":
        return (
          <TextField
            key={param.name}
            label={param.label}
            type="number"
            value={params[param.name] || ""}
            onChange={(e) => handleParamChange(param.name, Number(e.target.value))}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />
        );
      case "boolean":
        return (
          <FormControlLabel
            key={param.name}
            label={param.label}
            control={
              <Switch
                checked={params[param.name] ?? true}
                onChange={(e) => handleParamChange(param.name, e.target.checked)}
              />
            }
          />
        );
      case "select":
        return (
          <FormControl fullWidth key={param.name} size="small" sx={{ mb: 2 }}>
            <InputLabel>{param.label}</InputLabel>
            <Select
              value={params[param.name] || ""}
              onChange={(e) => handleParamChange(param.name, e.target.value)}
              label={param.label}
            >
              {param.options?.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case "page-select":
        return (
          <FormControl fullWidth key={param.name} size="small" sx={{ mb: 2 }}>
            <InputLabel>{param.label}</InputLabel>
            <Select
              value={params[param.name] || ""}
              onChange={(e) => handleParamChange(param.name, e.target.value)}
              label={param.label}
            >
              {pages?.map((p) => (
                <MenuItem key={p._id} value={p.pageUniqueId}>
                  {p.pageName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Select Action</InputLabel>
        <Select
          value={selectedActionType}
          onChange={(e) => handleActionSelect(e.target.value)}
          label="Select Action"
        >
          {actions.map((a) => (
            <MenuItem key={a.config.type} value={a.config.type}>
              {a.config.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedAction &&
        selectedAction.config.parameters.map((param) => renderParameterField(param))}
    </Box>
  );
};