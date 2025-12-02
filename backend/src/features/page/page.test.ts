import { BaseCrudTest } from "../base/base.test.helper";
import { IPage } from "./page.types";

describe('Pages API', () => {
  const baseCrudTest = new BaseCrudTest<IPage>({
    resourceName: 'page',
    endpoint: '/api/pages',
    createPayload: {
      pageName: 'Test Page',
      pagePath: '/test-page',
      pageRenderMethod: 'static',
      rootElement: 'root123',
      pageActive: true,
      pageColor: 'white',
      pageEntranceAnimation: 'animate__fadeIn',
      pageExitAnimation: 'animate__fadeOut',
    },
    updatePayload: {
      pageName: 'Updated Page Name',
      rootElement: 'root456',
    },
    createExpectations: [
      { field: 'pageName', value: 'Test Page' },
      { field: 'rootElement', value: 'root123' },
    ],
    updateExpectations: {
      field: 'pageName',
      value: 'Updated Page Name',
    },
  });

  baseCrudTest.runAllTests();
});
