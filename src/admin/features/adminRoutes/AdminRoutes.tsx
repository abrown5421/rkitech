import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminAuth from '../auth/AdminAuth';
import AdminDashboard from '../dashboard/AdminDashboard';
import PagesEditor from '../pages/PagesEditor';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AdminAuth />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="pages" element={<PagesEditor />} />
    </Routes>
  );
};

export default AdminRoutes;