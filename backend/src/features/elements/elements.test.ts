import { BaseCrudTest } from '../base/base.test.helper';
import { IElements } from './elements.types';

describe('Elementss API', () => {
  const baseCrudTest = new BaseCrudTest<IElements>({
    resourceName: 'elements',
    endpoint: '/api/elements',
    createPayload: {
      name: "Test",
      type: 'Test Value',
      data: { test: true },
    },
    updatePayload: {
      type: 'Updated Elements Field',
      data: { updated: true },
    },
    createExpectations: [
      { field: 'type', value: 'Test Value' },
    ],
    updateExpectations: {
      field: 'type',
      value: 'Updated Elements Field',
    },
  });

  baseCrudTest.runAllTests();
});

function getDefaultTestValue(type: string) {
  switch (type) {
    case 'String': return "'Test Value'";
    case 'Number': return 123;
    case 'Boolean': return true;
    case 'Date': return 'new Date()';
    default: return "'Sample'";
  }
}
