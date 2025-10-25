import React from 'react';
import type { HealthyProps } from './HealthTypes';
import Pod from '../../components/pod/Pod';

const Healthy: React.FC<HealthyProps> = ({
    progress
}) => {
    return (
      <Pod className="flex items-center justify-center w-screen h-screen bg-secondary">
        <Pod className="text-lg font-semibold text-gray-700 flex flex-col items-center">
          <progress
            className="progress progress-primary w-56"
            value={progress}
            max="100"
          ></progress>
          <p className="mt-2 text-sm text-primary">{progress}%</p>
        </Pod>
      </Pod>
    );
};
export default Healthy;
