import React from 'react';
import Navbar from './features/navbar/Navbar';
import Footer from './features/footer/Footer';

const App: React.FC = () => {

  return (
    <div className='flex flex-col w-screen h-screen'>
      <Navbar />
      <Footer />
    </div>
  );
};
export default App;
