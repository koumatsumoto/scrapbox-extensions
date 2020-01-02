import { Observable } from 'rxjs';
import { DeviceMotion, DeviceOrientation } from '../types';
import { getDeviceOrientationStream } from '../deviceorientation/get-device-orientation-stream';
import { getDeviceMotionStream } from '../devicemotion';
import { withHistory, getRx } from '../../rxjs';
import { aggregate, toType } from './aggregate';
import { toCommand } from './to-command';

export const getAggregationStream = (
  orientation$: Observable<DeviceOrientation> = getDeviceOrientationStream(),
  motion$: Observable<DeviceMotion> = getDeviceMotionStream(),
) => {
  const { bufferCount, map, withLatestFrom } = getRx().operators;
  let sid = 0;
  let sidCommandDetermined = -1;

  return motion$.pipe(
    bufferCount(4),
    withLatestFrom(orientation$),
    map(([motions, orientation]) => {
      const gammas = motions.map((m) => m.rotationRate.gamma);
      const aggregation = aggregate(gammas);
      const type = toType(aggregation);

      const direction = orientation.gamma > 0 ? 'right' : 'left';

      return {
        sid: sid++,
        direction,
        type,
      };
    }),
    withHistory(8),
    map((motionSet) => {
      const toHandle = motionSet.filter((m) => m.sid > sidCommandDetermined);
      const lastSid = toHandle[toHandle.length - 1];
      const command = toCommand(motionSet.map((m) => m.type));
      if (command !== 'nothing') {
        sidCommandDetermined = lastSid.sid;
      }

      return command;
    }),
    withHistory(12),
  );
};

export const getAggregationStreamForDebug = (
  orientation$: Observable<DeviceOrientation> = getDeviceOrientationStream(),
  motion$: Observable<DeviceMotion> = getDeviceMotionStream(),
) => {
  const { bufferCount, filter, map, withLatestFrom } = getRx().operators;
  let sid = 0;

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
    withHistory(8),
  );
};
