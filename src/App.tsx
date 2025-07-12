import React from 'react';
import Text from './shared/components/text/Text';

const App: React.FC = () => {

  return (
    <div className=''>
      <Text text="This is extra small" size="xs" />
      <Text text="This is large and bold" size="lg" weight="bold" />
      <Text text="Italic and underlined" size="md" italic="italic" underline="underlined" />
      <Text text="Mono font in 3xl" size="3x" font="mono" />
    </div>
  );
};

export default App;
