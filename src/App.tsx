import React from 'react';
import Container from './shared/components/container/Container';
import Text from './shared/components/text/Text';

const App: React.FC = () => {

  return (
    <Container
      width="50%" height="100rem" 
      border='default'
    >
      <Text text='hello world' size='md' margin="lg" />
    </Container>
  );
};

export default App;
