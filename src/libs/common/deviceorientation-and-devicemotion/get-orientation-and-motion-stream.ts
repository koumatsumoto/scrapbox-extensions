import { getDeviceMotionStream } from './devicemotion';
import { getDeviceOrientationStream } from './deviceorientation/get-device-orientation-stream';
import { Observable } from 'rxjs';
import { DeviceMotion, DeviceOrientation } from './types';
import { getRx } from '../rxjs';
import { summarizeMotions } from './devicemotion/internal/summarize';

const defaultOption = {
  interval: 100,
};

/**
 * @param options
 * @param orientation$ - for testing
 * @param motion$ - for testing
 */
export const getOrientationAndMotionStream = (
  option: {
    interval: number;
  } = defaultOption,
  orientation$: Observable<DeviceOrientation> = getDeviceOrientationStream(),
  motion$: Observable<DeviceMotion> = getDeviceMotionStream(),
) => {
  const { Observable } = getRx();

  return new Observable((subscriber) => {
    let orientations: DeviceOrientation[] = [];
    let motions: DeviceMotion[] = [];

    orientation$.subscribe((v) => orientations.push(v));
    motion$.subscribe((v) => motions.push(v));

    setInterval(() => {
      if (orientations.length < 1 || motions.length < 1) {
        return;
      }

      const orientation = orientations[orientations.length - 1]!;
      const motion = summarizeMotions(motions)!;
      orientations = [];
      motions = [];

      subscriber.next({
        orientation,
        motion,
      });
    }, option.interval);
  });
};
