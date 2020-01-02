import { Observable } from 'rxjs';
import { DeviceMotion, DeviceOrientation } from '../types';
import { getDeviceOrientationStream } from '../deviceorientation/get-device-orientation-stream';
import { getDeviceMotionStream } from '../devicemotion';
import { getRx, withHistory } from '../../rxjs';
import { roundToInt } from '../../arithmetic';
import { aggregate, toType } from './aggregate';
import { Command, toCommand } from './to-command';

export const get4MotionWithOrientationStream = (
  orientation$: Observable<DeviceOrientation> = getDeviceOrientationStream(),
  motion$: Observable<DeviceMotion> = getDeviceMotionStream(),
) => {
  const { bufferCount, withLatestFrom } = getRx().operators;

  return motion$.pipe(bufferCount(4), withLatestFrom(orientation$));
};

export const getMotionAggregationsStream = () => {
  const { map } = getRx().operators;
  let sid = 0;

  return get4MotionWithOrientationStream().pipe(
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
  );
};

export const debug3 = () => {
  const { filter, map } = getRx().operators;

  return getMotionAggregationsStream().pipe(
    filter((d) => d.type !== 'neutral'),
    map((d) => {
      return {
        sid: d.sid,
        type: d.type,
      };
    }),
    withHistory(10),
    map((array) => array.reverse()),
  );
};

/**
 * orientation and motion aggregation raw data for gamma
 */
export const debug4 = () => {
  const { map } = getRx().operators;

  return get4MotionWithOrientationStream().pipe(
    map(([motions, orientation]) => {
      const gammas = motions.map((m) => m.rotationRate.gamma);
      const aggregation = aggregate(gammas);

      return {
        gamma: roundToInt(orientation.gamma),
        aggregation,
      };
    }),
  );
};

export const getMotionCommandStream = () => {
  const { Observable } = getRx();
  const { map } = getRx().operators;
  let commandDeterminedId = -1;
  const countToCommandDetermine = 8;
  let waitForDoubleTip = 0; // max 4

  return new Observable<Command | 'waiting' | 'check double tip'>((subscriber) => {
    getMotionAggregationsStream()
      .pipe(
        withHistory(countToCommandDetermine),
        map((items) => {
          const targets = items.filter((m) => m.sid > commandDeterminedId);
          if (targets.length < countToCommandDetermine) {
            return 'waiting';
          }

          const command = toCommand(targets.map((m) => m.type));
          if (command === 'nothing') {
            return 'nothing';
          }

          if (command === 'double tip') {
            commandDeterminedId = targets[targets.length - 1].sid;
            return 'double tip';
          }

          // when tip, need wait to detect double tip
          if (command === 'tip') {
            if (++waitForDoubleTip < 5) {
              return 'check double tip';
            } else {
              commandDeterminedId = targets[targets.length - 1].sid;
              return 'tip';
            }
          }

          return command;
        }),
      )
      .subscribe((value) => {
        subscriber.next(value);
      });
  });
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
