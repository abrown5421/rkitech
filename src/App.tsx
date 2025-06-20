import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Client from './client/Client';
import Admin from './admin/Admin';
import Init from './init/Init';
import { useInitializeApp } from './hooks/useInitializeApp';
import Loader from './components/loader/Loader';
import Alert from './components/alert/Alert';
import { useAppSelector } from './store/hooks';
import GlobalModal from './components/modal/GlobalModal';

const App: React.FC = () => {
  const loadingSite = useInitializeApp();
  const alert = useAppSelector((state) => state.alert)

   return (
    <div className='h-screen bg-gray-900'>
      {!loadingSite ? (
        <Routes>
          <Route path="/*" element={<Client />} />
          <Route path="admin/*" element={<Admin />} />
          <Route path="init/*" element={<Init />} />
        </Routes>
      ) : (
        <div className='h-screen w-screen flex justify-center items-center'>
          <Loader variant='hash' colorName='amber' colorIntensity={500} />
        </div>
      )}
                       
      <Alert
        open={alert.open}
        severity={alert.severity}
        message={alert.message}
      />

      <GlobalModal />

    </div>
   );
};
export default App;
