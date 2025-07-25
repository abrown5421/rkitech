import React from 'react';
import Text from './shared/text/Text';

const App: React.FC = () => {

   return (
    <div>
      <Text
        text="Hello World"
        twClasses={['text-xl', 'font-bold']}
        animation={{
          entrance: 'animate__fadeInUp',
          exit: 'animate__fadeOutDown',
          isEntering: true,
          delay: '0.25s', 
          speed: 'animate__fast', 
        }}
      />
    </div>
   );
};

export default App;
