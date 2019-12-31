import { calculateAverageAsInt } from './calculate-change';
import { createTestingDeviceMotionValue as v } from '../../test-helpers';

describe('calculateAverageAsInt', () => {
  it('should calculate well', () => {
    expect(calculateAverageAsInt([v(1), v(2), v(3)])).toEqual(v(2));
  });
});
