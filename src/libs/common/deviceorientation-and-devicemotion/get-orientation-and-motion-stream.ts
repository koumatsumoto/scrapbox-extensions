import { getDeviceMotionStream } from './devicemotion';
import { getDeviceOrientationStream } from './deviceorientation/get-device-orientation-stream';
import { Observable } from 'rxjs';
import { DeviceMotion, DeviceMotionValue, DeviceOrientation } from './types';
import { getRx } from '../rxjs';
import { calculateAverage } from './devicemotion/internal/calculate-average';
import { calculateMotionChange } from './devicemotion/internal/make-change';

const defaultOption = {
  interval: 80,
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
    let previousOrientation: DeviceOrientation;
    let previousMotion: DeviceMotion;

    orientation$.subscribe((v) => orientations.push(v));
    motion$.subscribe((v) => motions.push(v));

    setInterval(() => {
      // use last for orientation (current state is needed)
      const orientation = orientations[orientations.length - 1];
      if (orientation) {
        previousOrientation = orientation;
        orientations = [];
      }
      // use average for motion
      const motion = calculateAverage(motions);
      let motionChange: DeviceMotionValue | undefined;
      if (motion) {
        if (previousMotion) {
          motionChange = calculateMotionChange(motion, previousMotion);
        }
        previousMotion = motion;
        motions = [];
      }

      if (orientation) {
        subscriber.next({
          orientation,
          motion,
          motionChange,
        });
      }
    }, option.interval);
  });
};
