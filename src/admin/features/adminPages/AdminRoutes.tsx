import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminAuth from '../auth/AdminAuth';
import AdminDashboard from '../dashboard/AdminDashboard';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AdminAuth />} />
      <Route path="dashboard" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AdminRoutes;