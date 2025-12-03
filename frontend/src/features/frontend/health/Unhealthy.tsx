import React from 'react';
import type { UnhealthyProps } from './HealthTypes';

const Unhealthy: React.FC<UnhealthyProps> = ({ error }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#FF6266",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "450px",
          height: "300px",
          backgroundColor: "#F9FAFB",
          borderRadius: "15px",
          boxShadow: '0 0 10px 0 rgba(0,0,0,0.25)'
        }}
      >
        <h2 style={{color: "#FF6266"}}>Yikes! Something went wrong.</h2>
        <p>{error || "An unexpected error occurred while loading the app."}</p>
        <button
          onClick={() => window.location.reload()}
          onMouseEnter={(e) => {
            const target = e.currentTarget as HTMLButtonElement;
            target.style.backgroundColor = "#FF6266";
            target.style.color = "#000";
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget as HTMLButtonElement;
            target.style.backgroundColor = "transparent";
            target.style.color = "#FF6266";
          }}
          style={{
            padding: "6px 16px",
            border: "1px solid #FF6266",
            color: "#FF6266",
            borderRadius: "4px",
            backgroundColor: "transparent",
            fontSize: "0.875rem",
            fontWeight: 500,
            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
            textTransform: "uppercase",
            lineHeight: 1.75,
            letterSpacing: "0.02857em",
            cursor: "pointer",
            transition:
              "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default Unhealthy;
