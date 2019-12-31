import { getDeviceMotionStream } from './devicemotion';
import { getDeviceOrientationStream } from './deviceorientation/get-device-orientation-stream';
import { Observable, Subscription } from 'rxjs';
import { DeviceMotion, DeviceOrientation, OrientationAndMotionSummary, Precision } from './types';
import { getRx } from '../rxjs';
import { summarizeMotions } from './devicemotion/internal/summarize';
import { fixValue } from './fix-value';
import { forDebug } from './for-debug';
import { toManipulation } from './make-manipulation';

// use if needed
const defaultOption = {};

/**
 * @param options
 * @param orientation$ - for testing
 * @param motion$ - for testing
 */
export const getOrientationAndMotionStream = (
  option: {} = defaultOption,
  orientation$: Observable<DeviceOrientation> = getDeviceOrientationStream(),
  motion$: Observable<DeviceMotion> = getDeviceMotionStream(),
) => {
  const { Observable } = getRx();

  return new Observable<OrientationAndMotionSummary>((subscriber) => {
    let orientations: DeviceOrientation[] = [];
    let motions: DeviceMotion[] = [];
    let orientationSubscription: Subscription | undefined;
    let motionSubscription: Subscription | undefined;
    let setIntervalId: number | undefined;

    const registerInterval = (motionInterval: number) => {
      // time to process accumulated event data
      // process 5 motion events at once (temporary implementation)
      const processInterval = motionInterval * 5 + 1;

      setIntervalId = window.setInterval(() => {
        if (orientations.length < 1 || motions.length < 1) {
          return;
        }

        const orientation = orientations[orientations.length - 1]!;
        const interval = motions[0].interval; // interval never change in same device
        const summary = summarizeMotions(motions)!;
        orientations = [];
        motions = [];

        subscriber.next({
          orientation,
          motion: {
            interval,
            acceleration: summary.acceleration,
            accelerationIncludingGravity: summary.accelerationIncludingGravity,
            rotationRate: summary.rotationRate,
          },
        });
      }, processInterval);
    };

    orientation$.subscribe((v) => orientations.push(v));
    motion$.subscribe((v) => {
      if (setIntervalId === undefined) {
        registerInterval(v.interval);
      }
      motions.push(v);
    });

    return () => {
      if (setIntervalId !== undefined) {
        clearInterval(setIntervalId);
      }
      if (orientationSubscription) {
        orientationSubscription.unsubscribe();
      }
      if (motionSubscription) {
        motionSubscription.unsubscribe();
      }
    };
  });
};

export const getOrientationAndMotionSummary = (
  option: {
    interval: number;
    precision: Precision;
  } = {
    interval: 200,
    precision: 0,
  },
) => {
  return getOrientationAndMotionStream(option).pipe(fixValue(option.precision), toManipulation());
};

export const getOrientationAndMotionDebugString = (
  option: {
    interval: number;
    precision: Precision;
  } = {
    interval: 200,
    precision: 0,
  },
) => {
  return getOrientationAndMotionStream(option).pipe(fixValue(option.precision), forDebug());
};
