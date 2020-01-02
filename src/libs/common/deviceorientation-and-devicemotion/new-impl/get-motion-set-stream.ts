import { Observable } from 'rxjs';
import { DeviceMotion, DeviceOrientation } from '../types';
import { getDeviceOrientationStream } from '../deviceorientation/get-device-orientation-stream';
import { getDeviceMotionStream } from '../devicemotion';
import { getRx, withHistory } from '../../rxjs';
import { aggregate, toType } from './aggregate';
import { toCommand } from './to-command';

export const getMotionAggregationsStream = (
  orientation$: Observable<DeviceOrientation> = getDeviceOrientationStream(),
  motion$: Observable<DeviceMotion> = getDeviceMotionStream(),
) => {
  const { bufferCount, map, withLatestFrom } = getRx().operators;
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
        sid: sid++,
        direction,
        type,
      };
    }),
    withHistory(8),
  );
};

export const getMotionCommandStream = () => {
  const { map } = getRx().operators;
  let sidCommandDetermined = -1;

  return getMotionAggregationsStream().pipe(
    map((motionSet) => {
      const targets = motionSet.filter((m) => m.sid > sidCommandDetermined);
      if (targets.length < 8) {
        return 'waiting';
      }

      const command = toCommand(targets.map((m) => m.type));
      if (command !== 'nothing') {
        const lastSid = targets[targets.length - 1];
        sidCommandDetermined = lastSid.sid;
      }

      return command;
    }),
  );
};

export const getCommandHistoryStream = () => {
  return getMotionCommandStream().pipe(withHistory(16));
};

export const getLastCommandStream = () => {
  const { filter } = getRx().operators;

  return getMotionCommandStream().pipe(
    filter((c) => {
      if (c === 'nothing' || c === 'waiting') {
        return false;
      } else {
        return true;
      }
    }),
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
