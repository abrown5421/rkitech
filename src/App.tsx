import React from 'react';
import Button from './shared/components/button/Button';

const App: React.FC = () => {

  return (
    <div>
    <Button
      variant="solid"
      color="success"
      padding="lg"
      shadow
      onClick={() => console.log("Clicked!")}
    >
      Submit
    </Button>
    </div>
  );
};

export default App;
