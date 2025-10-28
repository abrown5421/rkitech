import { BaseCrudTest } from '../base/base.test.helper';
import { IConfiguration } from './configurations.types';

describe('Configurations API', () => {
  const baseCrudTest = new BaseCrudTest<IConfiguration>({
    resourceName: 'configurations',
    endpoint: '/api/configurations',
    createPayload: {
      key: 'Test Value',
      data: { test: true },
    },
    updatePayload: {
      key: 'Updated Configurations Field',
      data: { updated: true },
    },
    createExpectations: [
      { field: 'key', value: 'Test Value' },
    ],
    updateExpectations: {
      field: 'key',
      value: 'Updated Configurations Field',
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
