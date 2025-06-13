import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Client from './client/Client';
import Admin from './admin/Admin';
import Init from './init/Init';

const App: React.FC = () => {

   return (
    <div className='h-screen bg-gray-900'>
      <Routes>
        <Route path="/*" element={<Client />} />
        <Route path="Admin/*" element={<Admin />} />
        <Route path="Init/*" element={<Init />} />
      </Routes>
    </div>
   );
};
export default App;
