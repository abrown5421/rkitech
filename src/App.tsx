import React from 'react';
import Loader from './shared/components/loader/Loader';

const App: React.FC = () => {

  return (
    <div className='w-screen'>
      <Loader variant="flash" color="bg-blue-500" size={12} />
      <Loader variant="bounce" color="bg-red-400" size={20} />
      <Loader variant="spinner" color="border-green-500" size={30} />
    </div>
  );
};

export default App;
