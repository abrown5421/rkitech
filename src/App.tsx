import React from 'react';
import Button from './shared/components/button/Button';
import Icon from './shared/components/icon/Icon';

const App: React.FC = () => {

  return (
    <div>
    <Icon
      name="Heart"
      color="text-red-500"
      padding="sm"
      margin="md"
      width="w-6"
      height="h-6"
      animation={{
        hover: {
          hoverAnimation: 'animate__bounce',
          repeat: 2,
        },
      }}
      onClick={() => console.log('Heart icon clicked')}
    />
    </div>
  );
};

export default App;
