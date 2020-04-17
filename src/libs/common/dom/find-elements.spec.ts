import { setupBodyForTest } from '../../../test-helpers';
import { findElementOrFail, findElements } from './find-elements';

describe('findElementOrFail', () => {
  it('should retrieve an element from DOM', () => {
    expect(findElementOrFail('body')).toBeTruthy();
  });

  it('should throw if not found', () => {
    expect(() => findElementOrFail('not-found')).toThrow();
  });
});

describe('findElements', () => {
  beforeEach(() => {
    setupBodyForTest();
  });

  it('should retrieve elements from parent element', () => {
    expect(findElements('body').length).toBe(1);
    expect(findElements('not-found').length).toBe(0);
  });
});
