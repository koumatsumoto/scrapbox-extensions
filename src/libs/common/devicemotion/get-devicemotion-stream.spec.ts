import { getDeviceMotionChangeStream, getDeviceMotionStream } from './get-devicemotion-stream';
import { Subject } from 'rxjs';

describe('getDeviceMotionStream', () => {
  it('should get an observable', () => {
    const $ = getDeviceMotionStream();
    expect(typeof $.subscribe).toBe('function');
    expect(typeof $.pipe).toBe('function');
  });
});

describe('getDeviceMotionChangeStream', () => {
  it('should emit calculated value', (done: Function) => {
    const subject = new Subject<DeviceMotionEvent>();

    getDeviceMotionChangeStream(subject.asObservable()).subscribe((data) => {
      expect(data).toEqual({
        acceleration: {
          x: 10000,
          y: 10000,
          z: 10000,
        },
        accelerationIncludingGravity: {
          x: 10000,
          y: 10000,
          z: 10000,
        },
        interval: 1,
        rotationRate: {
          alpha: 10000,
          beta: 10000,
          gamma: 10000,
        },
      });
      done();
    });

    subject.next({
      acceleration: {
        x: 1,
        y: 1,
        z: 1,
      },
      accelerationIncludingGravity: {
        x: 1,
        y: 1,
        z: 1,
      },
      rotationRate: {
        alpha: 1,
        beta: 1,
        gamma: 1,
      },
      interval: 1,
    } as DeviceMotionEvent);
  });
});
