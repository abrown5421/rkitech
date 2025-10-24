import React from 'react';
import Navbar from './features/navbar/Navbar';
import Footer from './features/footer/Footer';
import { usePreloadData } from './hooks/usePreloadData';
import { ExclamationCircleIcon } from "@heroicons/react/24/solid"; 
import PageShell from './features/page/PageShell';
import { Route, Routes } from 'react-router-dom';

const App: React.FC = () => {
  const { loading, error, pages, progress } = usePreloadData();

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-secondary">
        <div className="text-lg font-semibold text-gray-700 flex flex-col items-center">
          <progress
            className="progress progress-primary w-56"
            value={progress}
            max="100"
          ></progress>
          <p className="mt-2 text-sm text-primary">{progress}%</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-error">
        <div className="bg-base-100 border border-error/40 rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="flex w-full justify-center items-center mb-4">
            <ExclamationCircleIcon className='w-15 h-15 text-error'/>
          </div>
          <h2 className="text-2xl font-bold text-error mb-2">
            Yikes! Something went wrong.
          </h2>
          <p className="text-base text-base-content/70 mb-6">
            {error || 'An unexpected error occurred while loading the application.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-error btn-outline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-screen h-screen">
      <Navbar />
      <Routes>
        {pages.map((p) => (
          <Route
            key={p._id}
            path={p.pagePath} 
            element={<PageShell page={p} />}
          />
        ))}
      </Routes>
    </div>
  );
};

export default App;
