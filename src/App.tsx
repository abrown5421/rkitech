import React, { useState } from 'react';
import Input from './shared/components/input/Input';
import Icon from './shared/components/icon/Icon';

const App: React.FC = () => {
  const [email, setEmail] = useState('');

  return (
    <div className='w-screen'>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        startAdornment={<Icon name='Mail' height={20} width={20} />}
        animation={{
          hover: {
            hoverAnimation: "animate__pulse",
            repeat: 2,
          }
        }}
      />
    </div>
  );
};

export default App;
