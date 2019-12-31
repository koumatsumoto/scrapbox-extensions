import { getDeviceMotionWithChangeStream, getPartialDeviceMotionStream } from './get-device-motion-stream';
import { Subject } from 'rxjs';
import { PartialDeviceMotion } from './types';
import { createTestingDeviceMotionValue } from './test-helpers';

describe('getPartialDeviceMotionStream', () => {
  it('should get an observable', () => {
    const $ = getPartialDeviceMotionStream();
    expect(typeof $.subscribe).toBe('function');
    expect(typeof $.pipe).toBe('function');
  });
});

describe('getDeviceMotionChangeStream', () => {
  it('should emit calculated value', (done: Function) => {
    const precision = 8;
    const scale = 10000;
    const interval = 10;
    const $ = new Subject<PartialDeviceMotion>();

    getDeviceMotionWithChangeStream({ precision, scale }, $.asObservable()).subscribe((data) => {
      const average = 5 / interval;
      const equalized = average / scale;
      expect(data).toEqual(createTestingDeviceMotionValue(equalized * 10 ** precision));
      done();
    });

    const v = (val: number) => ({ ...createTestingDeviceMotionValue(val), interval });
    $.next(v(10));
    $.next(v(20)); // change +10
    $.next(v(10)); // change -10
    $.next(v(10)); // change 0
    $.next(v(10)); // change 0
    $.next(v(10)); // change 0
    $.next(v(10)); // change 0
    $.next(v(10)); // change 0
    $.next(v(10)); // change 0
    $.next(v(40)); // change +30
    $.next(v(60)); // change +20
  });
});
