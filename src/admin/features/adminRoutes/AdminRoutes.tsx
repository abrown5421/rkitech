import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminAuth from '../auth/AdminAuth';
import AdminDashboard from '../dashboard/AdminDashboard';
import PagesEditor from '../pages/PagesEditor';
import MenuEditor from '../menus/MenuEditor';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AdminAuth />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="pages" element={<PagesEditor />} />
      <Route path="menus" element={<MenuEditor />} />
    </Routes>
  );
};

export default AdminRoutes;