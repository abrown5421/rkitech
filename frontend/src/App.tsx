import React from 'react';
import { Container } from 'rkitech-components';
import { useGetPagesQuery } from './features/page/pageApi';

const App: React.FC = () => {
  const { data: pages, isLoading, error } = useGetPagesQuery();

  if (isLoading) return <p>Loading pages...</p>;
  if (error) return <p>Error loading pages</p>;

  return (
    <Container tailwindClasses='w-full h-full'>
      {pages?.map((page) => (
        <div key={page._id}>{page.pageName}</div>
      ))}
    </Container>
  );
};
export default App;
