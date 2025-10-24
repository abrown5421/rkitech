import React from 'react';
import type { HealthyProps } from './HealthTypes';

const Healthy: React.FC<HealthyProps> = ({
    progress
}) => {
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
};
export default Healthy;
