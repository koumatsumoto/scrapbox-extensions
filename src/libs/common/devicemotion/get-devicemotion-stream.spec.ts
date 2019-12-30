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
        change: {
          acceleration: {
            x: 20000,
            y: 20000,
            z: 20000,
          },
          accelerationIncludingGravity: {
            x: 20000,
            y: 20000,
            z: 20000,
          },
          rotationRate: {
            alpha: 20000,
            beta: 20000,
            gamma: 20000,
          },
        },
        data: {
          acceleration: {
            x: 30000,
            y: 30000,
            z: 30000,
          },
          accelerationIncludingGravity: {
            x: 30000,
            y: 30000,
            z: 30000,
          },
          interval: 3,
          rotationRate: {
            alpha: 30000,
            beta: 30000,
            gamma: 30000,
          },
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
    subject.next({
      acceleration: {
        x: 3,
        y: 3,
        z: 3,
      },
      accelerationIncludingGravity: {
        x: 3,
        y: 3,
        z: 3,
      },
      rotationRate: {
        alpha: 3,
        beta: 3,
        gamma: 3,
      },
      interval: 3,
    } as DeviceMotionEvent);
  });
});
