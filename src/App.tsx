import React from 'react';
import Button from './shared/components/button/Button';

const App: React.FC = () => {

  const animationObj = {
    entranceAnimation: 'animate__fadeIn',
    exitAnimation: 'animate__fadeOut',
    isEntering: true,
  };

  return (
    <div>
    <Button
      variant="solid"
      color="success"
      padding="lg"
      shadow
      onClick={() => console.log("Clicked!")}
      animationObject={animationObj}
    >
      Submit
    </Button>
    </div>
  );
};

export default App;
