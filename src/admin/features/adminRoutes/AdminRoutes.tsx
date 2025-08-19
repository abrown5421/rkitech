import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminAuth from '../auth/AdminAuth';
import AdminDashboard from '../dashboard/AdminDashboard';
import PagesEditor from '../pages/PagesEditor';
import MenuEditor from '../menus/MenuEditor';
import BlogEditor from '../blog/BlogEditor';
import GalleryEditor from '../gallery/GalleryEditor';
import StaffEditor from '../staff/StaffEditor';
import PageEditor from '../pageEditor/PageEditor';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AdminAuth />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="pages" element={<PagesEditor />} />
      <Route path="page/:pageComponentKey" element={<PageEditor />} />
      <Route path="menus" element={<MenuEditor />} />
      <Route path="blog" element={<BlogEditor />} />
      <Route path="gallery" element={<GalleryEditor />} />
      <Route path="staff" element={<StaffEditor />} />
    </Routes>
  );
};

export default AdminRoutes;