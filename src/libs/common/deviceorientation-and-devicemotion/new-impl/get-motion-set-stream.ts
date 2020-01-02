import { Observable } from 'rxjs';
import { DeviceMotion, DeviceOrientation } from '../types';
import { getDeviceOrientationStream } from '../deviceorientation/get-device-orientation-stream';
import { getDeviceMotionStream } from '../devicemotion';
import { getRx, withHistory } from '../../rxjs';
import { roundToInt } from '../../arithmetic';
import { aggregate, classificate, MotionClassification } from './aggregate';
import { Command, CommandTypes, toCommand } from './to-command';

export const get4MotionWithOrientationStream = (
  orientation$: Observable<DeviceOrientation> = getDeviceOrientationStream(),
  motion$: Observable<DeviceMotion> = getDeviceMotionStream(),
) => {
  const { bufferCount, withLatestFrom } = getRx().operators;

  return motion$.pipe(bufferCount(4), withLatestFrom(orientation$));
};

// to check data by same sid
let singletonToDebug: Observable<{ sid: number; direction: string; data: MotionClassification }>;
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
      const data = classificate(aggregation);

      const direction = orientation.gamma > 0 ? 'right' : 'left';

      return {
        sid: sid++,
        direction,
        data,
      };
    }),
  );

  return singletonToDebug;
};

export const debug3 = () => {
  const { filter, map } = getRx().operators;

  return getMotionAggregationsStream().pipe(
    filter((d) => d.data.rate > 0),
    map((d) => {
      const di = d.data.direction === 'up' ? 'u' : 'd';
      return `${di}-${d.data.rate}: ${d.sid}`;
    }),
    withHistory(20),
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
  action: CommandTypes;
  sid: number;
  meta?: Command['meta'];
};

export const getMotionCommandStream = () => {
  const { Observable } = getRx();
  const { map } = getRx().operators;
  const minimumRequiredCount = 8;

  return new Observable<CommandData>((subscriber) => {
    let commandSubmittedId = -1;
    getMotionAggregationsStream()
      .pipe(
        withHistory(minimumRequiredCount),
        map((items) => {
          const targets = items.filter((m) => m.sid > commandSubmittedId);
          const latest = targets[targets.length - 1];

          // unreachable
          if (latest === undefined) {
            return {
              action: 'waiting',
              sid: -1,
            };
          }
          const sid = latest.sid;

          if (targets.length < minimumRequiredCount) {
            return {
              action: 'waiting',
              sid,
            };
          }

          const command = toCommand(targets.map((m) => m.data));
          switch (command.action) {
            case 'shake expecting next':
            case 'tip expecting next': {
              break;
            }
            default: {
              commandSubmittedId = sid;
              break;
            }
          }

          return {
            action: command.action,
            sid,
          };
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
    map((values) => values.map((v) => v.action)),
  );
};

export const getLastCommandStream = () => {
  const { filter, pairwise } = getRx().operators;

  return getMotionCommandStream().pipe(
    filter((c) => {
      if (c.action === 'nothing' || c.action === 'waiting') {
        return false;
      } else {
        return true;
      }
    }),
    pairwise(),
  );
};
