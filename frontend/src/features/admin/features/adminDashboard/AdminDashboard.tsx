import React from 'react';
import AnimBox from '../../../../components/animBox/AnimBox';

const AdminDashboard: React.FC = () => {
  return (
    <AnimBox
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
      }}
    >
      dashboard
    </AnimBox>
  );
};

export default AdminDashboard;
