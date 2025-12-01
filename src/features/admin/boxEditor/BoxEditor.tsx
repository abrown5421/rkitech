import React from 'react';
import { updateBoxProps } from './boxEditorSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { BoxEditorState } from './boxEditorTypes';

const BoxEditor: React.FC = () => {
  const boxProps = useAppSelector((state) => state.boxEditor);
  const dispatch = useAppDispatch();

  const handleChange = (key: keyof BoxEditorState, value: string) => {
    dispatch(updateBoxProps({ [key]: value }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <label>
        Display:
        <select
          value={boxProps.display || 'block'}
          onChange={(e) => handleChange('display', e.target.value)}
        >
          <option value="block">block</option>
          <option value="flex">flex</option>
          <option value="inline-block">inline-block</option>
          <option value="grid">grid</option>
        </select>
      </label>

      {boxProps.display === 'flex' && (
        <>
          <label>
            Flex Direction:
            <select
              value={boxProps.flexDirection || 'row'}
              onChange={(e) => handleChange('flexDirection', e.target.value)}
            >
              <option value="row">row</option>
              <option value="column">column</option>
            </select>
          </label>

          <label>
            Justify Content:
            <input
              value={boxProps.justifyContent || ''}
              placeholder="e.g., flex-start, center"
              onChange={(e) => handleChange('justifyContent', e.target.value)}
            />
          </label>

          <label>
            Align Items:
            <input
              value={boxProps.alignItems || ''}
              placeholder="e.g., flex-start, center"
              onChange={(e) => handleChange('alignItems', e.target.value)}
            />
          </label>
        </>
      )}

      <label>
        Gap:
        <input
          value={boxProps.gap || ''}
          placeholder="e.g., 10px"
          onChange={(e) => handleChange('gap', e.target.value)}
        />
      </label>

      <label>
        Margin:
        <input
          value={boxProps.m || ''}
          placeholder="e.g., 10px"
          onChange={(e) => handleChange('m', e.target.value)}
        />
      </label>

      <label>
        Padding:
        <input
          value={boxProps.p || ''}
          placeholder="e.g., 10px"
          onChange={(e) => handleChange('p', e.target.value)}
        />
      </label>

      <label>
        Width:
        <input
          value={boxProps.width || ''}
          placeholder="e.g., 100px, 50%"
          onChange={(e) => handleChange('width', e.target.value)}
        />
      </label>

      <label>
        Height:
        <input
          value={boxProps.height || ''}
          placeholder="e.g., 100px"
          onChange={(e) => handleChange('height', e.target.value)}
        />
      </label>

      <label>
        Background Color:
        <input
          type="color"
          value={boxProps.bgcolor || '#ffffff'}
          onChange={(e) => handleChange('bgcolor', e.target.value)}
        />
      </label>

      <label>
        Text Color:
        <input
          type="color"
          value={boxProps.color || '#000000'}
          onChange={(e) => handleChange('color', e.target.value)}
        />
      </label>

      <label>
        Border:
        <input
          value={boxProps.border || ''}
          placeholder="e.g., 1px solid #000"
          onChange={(e) => handleChange('border', e.target.value)}
        />
      </label>

      <label>
        Border Radius:
        <input
          value={boxProps.borderRadius || ''}
          placeholder="e.g., 4px"
          onChange={(e) => handleChange('borderRadius', e.target.value)}
        />
      </label>

      <label>
        Box Shadow:
        <input
          value={boxProps.boxShadow || ''}
          placeholder="e.g., 0px 4px 6px rgba(0,0,0,0.1)"
          onChange={(e) => handleChange('boxShadow', e.target.value)}
        />
      </label>
    </div>
  );
};

export default BoxEditor;
