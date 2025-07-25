import React from 'react';
import Text from './shared/text/Text';

const App: React.FC = () => {

   return (
    <div>
      <Text text='Hello World' twClasses={['text-9xl']} />
    </div>
   );
};

export default App;
