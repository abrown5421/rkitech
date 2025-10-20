import React from 'react';
import { Container, Loader } from 'rkitech-components';
import { usePreloadData } from './hooks/usePreloadData';

const App: React.FC = () => {
  const { loading, error } = usePreloadData();

  if (error) return <p>{error}</p>;

  return (
    <Container tailwindClasses='flex-col w-screen h-screen z-30 relative bg-gray-900'>
      {loading ? (
        <Container tailwindClasses="h-full w-full justify-center items-center">
          <Loader
            show={loading}
            loaderType='Bars'
            variant={2}
            color='amber'
            intensity={500}
          />
        </Container>
      ) : (
        <Container tailwindClasses="h-full w-full flex-col">
          app
        </Container>
      )}
    </Container>
  );
};

export default App;
