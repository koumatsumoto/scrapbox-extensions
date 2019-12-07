import { setupBodyForTest } from '../../test-helpers';
import { getPage } from './enable-line-structuralization';

describe('getPage', () => {
  beforeEach(() => {
    setupBodyForTest();
  });

  it('should get page instance', () => {
    const page = getPage();
  });
});
