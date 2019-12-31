import { Observable } from 'rxjs';
import { DeviceMotion, DeviceMotionWithChange, Precision } from '../types';
import { diff } from './get-change';
import { getRx } from '../../rxjs';
import { calculateAverage } from './calculate-average';
import { toInt } from './to-int';

// TODO: use pairwise
export const withChange = () => (source: Observable<DeviceMotion>) => {
  const { scan, skip } = getRx().operators;

  return source.pipe(
    scan<DeviceMotion, DeviceMotionWithChange, null>((state, val) => {
      if (state === null) {
        return {
          data: val,
          // must be skipped below, skip(1)
          change: undefined as any,
        };
      } else {
        return {
          data: val,
          change: diff(state.data, val),
        };
      }
    }, null),
    skip(1),
  ) as Observable<DeviceMotionWithChange>;
};

/**
 * @param denominator - default value is 4, used as buffer count
 */
export const toAverage = (denominator: number = 4) => (source: Observable<DeviceMotion>) => {
  const { bufferCount, map } = getRx().operators;

  return source.pipe(
    bufferCount(denominator),
    map((changes: DeviceMotion[]) => calculateAverage(changes)),
  );
};

export const toInteger = (precision: Precision = 8) => (source: Observable<DeviceMotion>) => {
  const { map } = getRx().operators;

  return source.pipe(map((v) => toInt(v, precision)));
};

export const toDebug = () => (source: Observable<DeviceMotionWithChange>) => {
  const { map } = getRx().operators;

  return source.pipe(
    map((v) => ({
      acceleration: {
        x: [v.data.acceleration.x, v.change.acceleration.x],
        y: [v.data.acceleration.y, v.change.acceleration.y],
        z: [v.data.acceleration.z, v.change.acceleration.z],
      },
      rotationRate: {
        alpha: [v.data.rotationRate.alpha, v.change.rotationRate.alpha],
        beta: [v.data.rotationRate.beta, v.change.rotationRate.beta],
        gamma: [v.data.rotationRate.gamma, v.change.rotationRate.gamma],
      },
    })),
  );
};
