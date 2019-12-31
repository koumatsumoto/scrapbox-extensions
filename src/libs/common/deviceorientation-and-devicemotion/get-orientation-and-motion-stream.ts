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
    let previousMotionAverage: DeviceMotionValue | undefined;

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
      const motionAverage = calculateMotionAverage(motions)!;
      const motionInterval = motions[0].interval; // interval don't change
      let motionAverageChange: DeviceMotionValue | undefined;
      if (previousMotionAverage) {
        motionAverageChange = calculateMotionChange(motionAverage, previousMotionAverage);
      }
      previousMotionAverage = motionAverage;
      motions = [];

      if (orientationChange && motionAverageChange) {
        subscriber.next({
          orientation: {
            current: currentOrientation,
            change: orientationChange,
          },
          motion: {
            interval: motionInterval,
            average: motionAverage,
            averageChange: motionAverageChange,
          },
        });
      }
    }, option.interval);
  });
};
