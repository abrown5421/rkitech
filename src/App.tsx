import React, { useState } from 'react';
import Select from './shared/components/select/Select';

const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('');

  return (
    <div className='w-screen'>
      <Select
        label="Country"
        margin='xl'
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
        error={!selectedCountry}
        helperText={!selectedCountry ? "Country is required" : ""}
      >
        <option value="" disabled>Select your country</option>
        <option value="us">United States</option>
        <option value="ca">Canada</option>
        <option value="uk">United Kingdom</option>
      </Select>
    </div>
  );
};

export default App;
