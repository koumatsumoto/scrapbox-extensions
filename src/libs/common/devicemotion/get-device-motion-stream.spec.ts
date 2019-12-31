import {
  getDeviceMotionWithChangeStream,
  getNewDeviceMotionWithChangeStream,
  getPartialDeviceMotionStream,
} from './get-device-motion-stream';
import { Subject } from 'rxjs';
import { DeviceMotion, PartialDeviceMotion } from './types';
import { createTestingDeviceMotionValue, doNextTick } from './test-helpers';

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

describe('getNewDeviceMotionWithChangeStream', () => {
  it('should emit expected value', (done: Function) => {
    const $ = new Subject<DeviceMotion>();

    doNextTick(() => {
      const interval = 10;
      const v = (val: number) => ({ ...createTestingDeviceMotionValue(val), interval });
      // averaged
      $.next(v(10));
      $.next(v(30)); // average 20
      // averaged
      $.next(v(10));
      $.next(v(50)); // average 30
    });

    getNewDeviceMotionWithChangeStream(
      {
        averageDenominator: 2,
        precision: 0,
      },
      $.asObservable(),
    ).subscribe((data) => {
      // debug purpose
      // expect(data).toEqual({});
      done();
    });
  });
});
