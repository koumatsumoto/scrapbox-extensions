import { Subject } from 'rxjs';
import { EntireDeviceMotionData } from '../types';
import { createTestingDeviceMotionDataWithInterval } from '../test-helpers';
import { makeChange } from './rx-operators';

describe('rx-operators', () => {
  describe('makeChange', () => {
    it('should make expected data', (done: Function) => {
      const $ = new Subject<EntireDeviceMotionData>();
      const interval = 10;
      const v = (value: number) => createTestingDeviceMotionDataWithInterval(value, interval);
      const firstValue = v(10);
      const nextValue = v(30);

      setTimeout(() => {
        $.next(firstValue);
        $.next(nextValue); // change +20
      });

      $.pipe(makeChange()).subscribe((data) => {
        expect(data).toEqual({
          change: {
            acceleration: {
              x: 20,
              y: 20,
              z: 20,
            },
            accelerationIncludingGravity: {
              x: 20,
              y: 20,
              z: 20,
            },
            rotationRate: {
              alpha: 20,
              beta: 20,
              gamma: 20,
            },
          },
          data: nextValue,
        });
        done();
      });
    });
  });
});
