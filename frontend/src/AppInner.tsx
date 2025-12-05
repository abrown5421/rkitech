import React, { useEffect } from "react";
import { Box } from "@mui/material";
import Navbar from "./features/admin/navbar/Navbar";
import Page from "./features/frontend/page/Page";
import { Route, Routes, useLocation } from "react-router-dom";
import type { IPage } from "./features/frontend/page/pageTypes";
import type { Theme } from "@mui/material";
import { useAppDispatch } from "./store/hooks";
import { setActivePage } from "./features/frontend/page/pageSlice";
import Alert from "./features/frontend/alert/Alert";

interface AppInnerProps {
  pages: IPage[];
  theme: Theme;
}

const AppInner: React.FC<AppInnerProps> = ({ pages, theme }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const pageNotFound = pages.find((p) => p.pageUniqueId === "page_id_page_not_found");
  
  useEffect(()=>{
    if (!pages || pages.length === 0) return;

    const page = pages.find((p) => p.pagePath === location.pathname)

    if (page) {
      dispatch(setActivePage({
        activePageUid: page.pageUniqueId,
        activePageAnimateIn: true,
        activePageObj: page
      }))
    } else if (pageNotFound) {
      dispatch(
        setActivePage({
          activePageUid: pageNotFound.pageUniqueId,
          activePageAnimateIn: true,
          activePageObj: pageNotFound, 
        })
      );
    }
  }, [pages, location])

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
      <Alert />
    </Box>
  );
};

export default AppInner;
