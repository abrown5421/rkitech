import React from 'react';
import type { LoaderProps, LoaderVariant } from './loaderTypes';
import {
  ClipLoader,
  CircleLoader,
  PulseLoader,
  BeatLoader,
  BarLoader,
  BounceLoader,
  DotLoader,
  GridLoader,
  HashLoader,
  MoonLoader,
  PacmanLoader,
  PuffLoader,
  RingLoader,
  RotateLoader,
  ScaleLoader,
  SyncLoader,
} from 'react-spinners';
import { tailwindToHex } from '../../utils/tailwindToHex/tailwindToHex';

const loaderMap: Record<LoaderVariant, React.ElementType> = {
  'clip': ClipLoader,
  'circle': CircleLoader,
  'pulse': PulseLoader,
  'beat': BeatLoader,
  'bar': BarLoader,
  'bounce': BounceLoader,
  'dot': DotLoader,
  'grid': GridLoader,
  'hash': HashLoader,
  'moon': MoonLoader,
  'pacman': PacmanLoader,
  'puff': PuffLoader,
  'ring': RingLoader,
  'rotate': RotateLoader,
  'scale': ScaleLoader,
  'sync': SyncLoader,
};


const Loader: React.FC<LoaderProps> = ({
  twClasses = [],
  variant = 'clip',
  colorName = 'amber',
  colorIntensity = 400,
  size = 40,
  ...rest
}) => {
  const Spinner = loaderMap[variant] || ClipLoader;
  const color = tailwindToHex(colorName, colorIntensity);

  return (
    <div className={twClasses.join(' ')} {...rest}>
      <Spinner color={color} size={size} />
    </div>
  );
};

export default Loader;
