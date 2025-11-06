import { BaseCrudTest } from '../base/base.test.helper';
import { ITheme } from './theme.types';

describe('Themes API', () => {
  const baseCrudTest = new BaseCrudTest<ITheme>({
    resourceName: 'theme',
    endpoint: '/api/themes',
    createPayload: {
      name: 'Test Theme',
      active: true,
      primary: { main: '#111111', content: '#FFFFFF' },
      secondary: { main: '#222222', content: '#FFFFFF' },
      accent: { main: '#333333', content: '#FFFFFF' },
      success: { main: '#28a745', content: '#FFFFFF' },
      warning: { main: '#ffc107', content: '#000000' },
      error: { main: '#dc3545', content: '#FFFFFF' },
      neutral: { main: '#6c757d', content: '#FFFFFF' },
      neutral2: { main: '#6c757d', content: '#FFFFFF' },
      neutral3: { main: '#6c757d', content: '#FFFFFF' },
    },
    updatePayload: {
      name: 'Updated Theme',
      active: false,
      primary: { main: '#000000', content: '#FFFF00' },
    },
    createExpectations: [
      { field: 'name', value: 'Test Theme' },
      { field: 'primary', value: { main: '#111111', content: '#FFFFFF' } },
    ],
    updateExpectations: {
      field: 'name',
      value: 'Updated Theme',
    },
  });

  baseCrudTest.runAllTests();
});
