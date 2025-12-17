import { BaseCrudTest } from '../base/base.test.helper'; 
import { IElements } from './elements.types';

describe('Elements API', () => {
  const baseCrudTest = new BaseCrudTest<IElements>({
    resourceName: 'elements',
    endpoint: '/api/elements',
    createPayload: {
      name: "Test Element",
      component: 'Box',
      props: { test: true },
      childText: "Hello",
      styles: { color: 'red' },
      sx: { m: 2 },
      className: 'test-class',
      droppable: true,
      children: [],
    },
    updatePayload: {
      component: 'Stack',      
      props: { updated: true },
      childText: "Updated text",
    },
    createExpectations: [
      { field: 'component', value: 'Box' },
      { field: 'droppable', value: true },
    ],
    updateExpectations: {
      field: 'component',
      value: 'Stack',
    },
  });

  baseCrudTest.runAllTests();
});
