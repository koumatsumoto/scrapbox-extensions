import { Observable } from 'rxjs';
import { DeviceMotion, DeviceOrientation } from '../types';
import { getDeviceOrientationStream } from '../deviceorientation/get-device-orientation-stream';
import { getDeviceMotionStream } from '../devicemotion';
import { asSet, getRx } from '../../rxjs';
import { aggregate, toType } from './aggregate';

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
      const type = toType(aggregation);

      const direction = orientation.gamma > 0 ? 'right' : 'left';

      return {
        direction,
        type,
      };
    }),
    asSet(8),
  );
};

export const getAggregationStreamForDebug = (
  orientation$: Observable<DeviceOrientation> = getDeviceOrientationStream(),
  motion$: Observable<DeviceMotion> = getDeviceMotionStream(),
) => {
  const { bufferCount, filter, map, withLatestFrom } = getRx().operators;
  let sid = 0;
  let minId = 0;
  window.setInterval(() => {
    minId = sid;
  }, 1000 * 10);

  return motion$.pipe(
    bufferCount(4),
    withLatestFrom(orientation$),
    map(([motions, orientation]) => {
      const gammas = motions.map((m) => m.rotationRate.gamma);
      const aggregation = aggregate(gammas);
      const type = toType(aggregation);

      const direction = orientation.gamma > 0 ? 'right' : 'left';

      return {
        direction,
        type,
      };
    }),
    filter((v) => v.type !== 'neutral'),
    map((o) => ({ ...o, sid: sid++ })),
    asSet(8),
  );
};
