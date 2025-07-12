import React from 'react';
import Container from './shared/components/container/Container';

const App: React.FC = () => {

  return (
    <Container
      width="50%" height="100rem" 
      border='default'
    >
      <p>This container is half width and full screen height</p>
    </Container>
  );
};

export default App;
