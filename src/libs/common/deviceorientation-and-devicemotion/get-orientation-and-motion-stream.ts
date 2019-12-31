import { getDeviceMotionStream } from './devicemotion';
import { getDeviceOrientationStream } from './deviceorientation/get-device-orientation-stream';
import { Observable } from 'rxjs';
import { DeviceMotion, DeviceMotionValue, DeviceOrientation, DeviceOrientationValue } from './types';
import { getRx } from '../rxjs';
import { calculateMotionAverage } from './devicemotion/internal/calculate-average';
import { calculateMotionChange } from './devicemotion/internal/make-change';
import { calculateOrientationChange } from './deviceorientation/internal/calculate-change';

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
    let previousOrientation: DeviceOrientation | undefined;
    let previousMotion: DeviceMotion | undefined;

    orientation$.subscribe((v) => orientations.push(v));
    motion$.subscribe((v) => motions.push(v));

    setInterval(() => {
      if (orientations.length < 1 || motions.length < 1) {
        return;
      }

      // use last for orientation (current state is needed)
      const currentOrientation = orientations[orientations.length - 1]!;
      let orientationChange: DeviceOrientationValue | undefined;
      if (previousOrientation) {
        orientationChange = calculateOrientationChange(currentOrientation, previousOrientation);
      }
      previousOrientation = currentOrientation;
      orientations = [];

      // use average for motion
      const motion = calculateMotionAverage(motions)!;
      let motionChange: DeviceMotionValue | undefined;
      if (previousMotion) {
        motionChange = calculateMotionChange(motion, previousMotion);
      }
      previousMotion = motion;
      motions = [];

      if (orientationChange && motionChange) {
        subscriber.next({
          orientation: currentOrientation,
          orientationChange,
          motion,
          motionChange,
        });
      }
    }, option.interval);
  });
};
