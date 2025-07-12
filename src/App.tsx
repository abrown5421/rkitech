import React from 'react';
import Button from './shared/components/button/Button';

const App: React.FC = () => {

  return (
    <div>
    <Button
      color="success"
      variant="solid"
      animation={{
        hover: {
          hoverAnimation: 'animate__pulse',
        }
      }}

    >
      Hover me & fade in/out!
    </Button>
    </div>
  );
};

export default App;
