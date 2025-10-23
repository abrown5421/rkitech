import React from 'react';
import Navbar from './features/navbar/Navbar';

const App: React.FC = () => {

  return (
    <div className='flex flex-col w-screen h-screen'>
      <Navbar />
    </div>
  );
};
export default App;
