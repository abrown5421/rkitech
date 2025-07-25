import React from 'react';
import Text from './shared/text/Text';

const App: React.FC = () => {

   return (
    <div>
      <Text text='Hello World' twClasses='text-9xl text-red-500 hover:text-green-500' />
    </div>
   );
};

export default App;
