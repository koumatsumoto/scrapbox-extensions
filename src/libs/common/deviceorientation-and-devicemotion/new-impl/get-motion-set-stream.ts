import { Observable } from 'rxjs';
import { DeviceMotion, DeviceOrientation } from '../types';
import { getDeviceOrientationStream } from '../deviceorientation/get-device-orientation-stream';
import { getDeviceMotionStream } from '../devicemotion';
import { getRx, withHistory } from '../../rxjs';
import { roundToInt } from '../../arithmetic';
import { aggregate, MotionTypes, toType } from './aggregate';
import { Command, toCommand } from './to-command';

export const get4MotionWithOrientationStream = (
  orientation$: Observable<DeviceOrientation> = getDeviceOrientationStream(),
  motion$: Observable<DeviceMotion> = getDeviceMotionStream(),
) => {
  const { bufferCount, withLatestFrom } = getRx().operators;

  return motion$.pipe(bufferCount(4), withLatestFrom(orientation$));
};

// to check data by same sid
let singletonToDebug: Observable<{ sid: number; direction: string; type: MotionTypes }>;
export const getMotionAggregationsStream = () => {
  const { map } = getRx().operators;
  let sid = 0;

  if (singletonToDebug) {
    return singletonToDebug;
  }

  singletonToDebug = get4MotionWithOrientationStream().pipe(
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

  return singletonToDebug;
};

export const debug3 = () => {
  const { filter, map } = getRx().operators;

  return getMotionAggregationsStream().pipe(
    filter((d) => d.type !== 'neutral'),
    map((d) => {
      return {
        type: d.type,
        sid: d.sid,
      };
    }),
    withHistory(16),
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

type CommandData = {
  command: Command;
  sid: number;
};

export const getMotionCommandStream = () => {
  const { Observable } = getRx();
  const { map } = getRx().operators;
  let commandDeterminedId = -1;
  const countToCommandDetermine = 8;
  let waitForDoubleTip = 0; // max 4

  return new Observable<CommandData>((subscriber) => {
    getMotionAggregationsStream()
      .pipe(
        withHistory(countToCommandDetermine),
        map((items) => {
          const targets = items.filter((m) => m.sid > commandDeterminedId);
          const latest = targets[targets.length - 1];
          if (latest === undefined) {
            return {
              command: 'waiting',
              sid: -1,
            };
          }
          const sid = latest.sid;

          if (targets.length < countToCommandDetermine) {
            return {
              command: 'waiting',
              sid,
            };
          }

          const command = toCommand(targets.map((m) => m.type));
          if (command === 'nothing') {
            return {
              command: 'nothing',
              sid,
            };
          }

          if (command === 'double tip') {
            commandDeterminedId = sid;
            return {
              command: 'double tip',
              sid,
            };
          }

          // when tip, need wait to detect double tip
          if (command === 'tip') {
            if (++waitForDoubleTip < 5) {
              return {
                command: 'checking double tip',
                sid,
              };
            } else {
              commandDeterminedId = sid;
              return { command: 'tip', sid };
            }
          }

          return { command, sid };
        }),
      )
      .subscribe((value) => {
        subscriber.next(value as CommandData);
      });
  });
};

export const getCommandHistoryStream = () => {
  const { map } = getRx().operators;

  return getMotionCommandStream().pipe(
    withHistory(32),
    map((values) => values.map((v) => v.command)),
  );
};

export const getLastCommandStream = () => {
  const { filter } = getRx().operators;

  return getMotionCommandStream().pipe(
    filter((c) => {
      if (c.command === 'nothing' || c.command === 'waiting') {
        return false;
      } else {
        return true;
      }
    }),
  );
};
