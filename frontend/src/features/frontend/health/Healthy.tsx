import React from "react";
import type { HealthyProps } from "./HealthTypes";
import { useGetActiveThemeQuery } from "../../theme/themeApi";

const Healthy: React.FC<HealthyProps> = () => {
  const { data: theme } = useGetActiveThemeQuery();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: theme?.neutral.main ?? "#F9FAFB",
        flexDirection: "column",
        fontFamily: "sans-serif",
      }}
    >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "4px solid #e0e0e0",
            borderTopColor: theme?.primary.main ?? "#FE9A00",
            animation: "spin 0.8s linear infinite",
          }}
        />
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Healthy;
