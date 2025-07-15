import React from 'react';
import Image from './shared/components/image/Image';

const App: React.FC = () => {

  return (
    <div className='w-screen'>
      <Image
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeJQeJyzgAzTEVqXiGe90RGBFhfp_4RcJJMQ&s"
        alt="Sample Image"
        
        height={50}
      />
    </div>
  );
};

export default App;
