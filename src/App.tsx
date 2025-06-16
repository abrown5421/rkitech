import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Client from './client/Client';
import Admin from './admin/Admin';
import Init from './init/Init';
import { useInitializeApp } from './hooks/useInitializeApp';
import Loader from './components/loader/Loader';

const App: React.FC = () => {
  const loadingSite = useInitializeApp();
  
   return (
    <div className='h-screen bg-gray-900'>
      {!loadingSite ? (
        <Routes>
          <Route path="/*" element={<Client />} />
          <Route path="Admin/*" element={<Admin />} />
          <Route path="Init/*" element={<Init />} />
        </Routes>
      ) : (
        <div className='h-screen w-screen flex justify-center items-center'>
          <Loader variant='hash' />
        </div>
      )}
    </div>
   );
};
export default App;
