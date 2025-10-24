import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';
import type { UnhealthyProps } from './HealthTypes';

const Unhealthy: React.FC<UnhealthyProps> = ({
    error
}) => {
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
};
export default Unhealthy;
