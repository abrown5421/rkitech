import React from 'react';
import Container from './shared/components/container/Container';

const App: React.FC = () => {

  return (
    <Container
      padding="lg"
      border="default"
      flexDirection="col"
      justifyContent="center"
      alignItems="center"
      width="w-1/2"
      height="h-screen"
    >
      <p>This container is half width and full screen height</p>
    </Container>
  );
};

export default App;
