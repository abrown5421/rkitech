import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Loader } from 'rkitech-components';
import { usePreloadData } from './hooks/usePreloadData';
import PageShell from './features/page/PageShell';

const App: React.FC = () => {
  const { loading, error, pages } = usePreloadData();

  if (error) return <p>{error}</p>;

  const activePages = pages.filter((page) => page.pageActive);

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
          {/* navbar */}
          <Container tailwindClasses={`w-full h-[54px] bg-gray-50 relative z-20 shadow-[0_2px_4px_rgba(0,0,0,0.15)]`}>
            nav here
          </Container>
          
          {/* route tree */}
          <Routes>
            {activePages.map((page) => (
              <Route
                key={page._id}
                path={page.pagePath}   
                element={<PageShell page={page} />}
              />
            ))}
          </Routes>
          
        </Container>
      )}
    </Container>
  );
};

export default App;
