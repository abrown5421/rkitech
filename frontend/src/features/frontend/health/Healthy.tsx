import React from "react";
import type { HealthyProps } from "./HealthTypes";
import { useGetActiveThemeQuery } from "../../theme/themeApi";

const Healthy: React.FC<HealthyProps> = ({ progress }) => {
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
          width: "200px",
          height: "10px",
          backgroundColor: theme?.neutral3.main ?? "#EEEEEE",
          borderRadius: 5,
          overflow: "hidden",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: theme?.primary.main ?? "#FE9A00",
            transition: "width 0.2s",
          }}
        />
      </div>
      <div style={{ fontWeight: "bold", color: theme?.primary.main ?? "#FE9A00" }}>{progress}%</div>
    </div>
  );
};

export default Healthy;
