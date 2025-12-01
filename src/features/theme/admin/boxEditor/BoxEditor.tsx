import React, { useState } from 'react';
import Box from '@mui/material/Box';
import type { BoxEditorState } from './boxEditorTypes';

const BoxEditor: React.FC = () => {
  const [props, setProps] = useState<BoxEditorState>({
    display: 'block',
    m: '0px',
    p: '0px',
    width: '100%',
    height: '100px',
    bgcolor: '#f0f0f0',
  });

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <div>
        
        <label>
          Margin:
          <input
            type="text"
            value={props.m}
            onChange={(e) => setProps({ ...props, m: e.target.value })}
          />
        </label>
      </div>

      <Box sx={{ ...props }}>
        Box Preview
      </Box>
    </div>
  );
};

export default BoxEditor;
