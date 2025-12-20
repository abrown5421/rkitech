import React, { createContext, useContext, useMemo } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import type { Viewport, ViewportContextValue } from "./viewportTypes";
import { useAppSelector } from "../../../store/hooks";

const ViewportContext = createContext<ViewportContextValue | null>(null);

export const ViewportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();

  const forcedViewport = useAppSelector((state) => {
    if (state.renderer.mobile) return "mobile";
    if (state.renderer.tablet) return "tablet";
    return null;
  });

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const naturalViewport: Viewport =
    isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

  const viewport = forcedViewport ?? naturalViewport;

  const value = useMemo(
    () => ({
      viewport,
      forced: Boolean(forcedViewport),
      isMobile: viewport === "mobile",
      isTablet: viewport === "tablet",
      isDesktop: viewport === "desktop",
    }),
    [viewport, forcedViewport]
  );

  return (
    <ViewportContext.Provider value={value}>
      {children}
    </ViewportContext.Provider>
  );
};

export const useViewport = () => {
  const ctx = useContext(ViewportContext);
  if (!ctx) {
    throw new Error("useViewport must be used inside ViewportProvider");
  }
  return ctx;
};
