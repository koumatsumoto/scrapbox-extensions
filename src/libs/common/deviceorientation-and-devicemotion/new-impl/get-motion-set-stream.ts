import { Observable } from 'rxjs';
import { DeviceMotion, DeviceOrientation } from '../types';
import { getDeviceOrientationStream } from '../deviceorientation/get-device-orientation-stream';
import { getDeviceMotionStream } from '../devicemotion';
import { asSet, getRx } from '../../rxjs';
import { aggregate } from './aggregate';

export const getAggregationStream = (
  orientation$: Observable<DeviceOrientation> = getDeviceOrientationStream(),
  motion$: Observable<DeviceMotion> = getDeviceMotionStream(),
) => {
  const { bufferCount, map, withLatestFrom } = getRx().operators;

  return motion$.pipe(
    bufferCount(4),
    withLatestFrom(orientation$),
    map(([motions, orientation]) => {
      const gammas = motions.map((m) => m.rotationRate.gamma);
      const aggregation = aggregate(gammas);

      const side = orientation.gamma > 0 ? 'right' : 'left';

      return {
        orientation: side,
        // bad performance
        ...aggregation,
      };
    }),
  );
};

export const getAggregationStream2 = () => {
  const { map } = getRx().operators;

  return getAggregationStream().pipe(
    map((v) => {
      return {
        o: v.orientation,
        t: v.type,
      };
    }),
    asSet(10),
  );
};
