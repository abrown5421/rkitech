import React from "react";
import { Box } from "@mui/material";
import Navbar from "./features/admin/navbar/Navbar";
import Page from "./features/frontend/page/Page";
import { Route, Routes, useLocation } from "react-router-dom";
import type { IPage } from "./features/frontend/page/pageTypes";
import type { Theme } from "@mui/material";

interface AppInnerProps {
  pages: IPage[];
  theme: Theme;
}

const AppInner: React.FC<AppInnerProps> = ({ pages, theme }) => {
  const location = useLocation();
  const pageNotFound = pages.find((p) => p.pageUniqueId === "page_id_page_not_found");

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100vw"
      height="100vh"
      bgcolor={theme.palette.neutral.content}
    >
      {location.pathname.startsWith("/admin") && <Navbar />}
      <Routes>
        {pages.map((p) => (
          <Route key={p._id} path={p.pagePath} element={<Page page={p} />} />
        ))}
        <Route path="*" element={<Page page={pageNotFound!} />} />
      </Routes>
    </Box>
  );
};

export default AppInner;
