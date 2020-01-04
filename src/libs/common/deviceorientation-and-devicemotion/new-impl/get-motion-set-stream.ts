import { Observable } from 'rxjs';
import { DeviceMotion, DeviceOrientation } from '../types';
import { getDeviceOrientationStream } from '../deviceorientation/get-device-orientation-stream';
import { getDeviceMotionStream } from '../devicemotion';
import { getRx, withHistory } from '../../rxjs';
import { combine } from './movement/combine';
import { ActionTypes } from './types';
import { isTap } from './action/tap';
import { classify, Movement } from './movement/classify-movement';
import { checkEnterMotionType, isLongHold, isShortHold } from './action/hold';

export const getMovementStream = (
  orientation$: Observable<DeviceOrientation> = getDeviceOrientationStream(),
  motion$: Observable<DeviceMotion> = getDeviceMotionStream(),
): Observable<{ sid: number; data: Movement }> => {
  const { bufferCount, map, withLatestFrom } = getRx().operators;

  let sid = 0;
  return motion$.pipe(
    bufferCount(4),
    withLatestFrom(orientation$),
    map(([motions, orientation]) => {
      const gammas = motions.map((m) => m.rotationRate.gamma);
      const aggregation = combine(orientation.gamma, gammas);
      const data = classify(aggregation);

      return {
        sid: sid++,
        data,
      };
    }),
  );
};

export const debug3 = () => {
  const { filter, map } = getRx().operators;

  return getMovementStream().pipe(
    filter((d) => d.data.rate > 0),
    map((d) => {
      const di = d.data.direction === 'up' ? 'u' : 'd';
      return `${di}-${d.data.rate}: ${d.sid}`;
    }),
    withHistory(20),
    map((array) => array.reverse()),
  );
};

type CommandData = {
  command: ActionTypes;
  // [first, last]
  sid?: number[];
};

export const getMotionCommandStream = () => {
  const { Observable } = getRx();
  const { map } = getRx().operators;

  return new Observable<CommandData>((subscriber) => {
    getMovementStream()
      .pipe(
        withHistory(10),
        map((items) => {
          const movements = items.map((m) => m.data);
          const sid = [items[0].sid, items[items.length - 1].sid];

          const array: Movement[] = [];
          for (let i = 1; i < 10; i++) {
            array.unshift(movements[movements.length - i]);

            switch (array.length) {
              case 10: {
                if (isLongHold(array)) {
                  return {
                    command: 'long hold',
                    sid,
                  };
                }

                break;
              }
              case 5: {
                const type = checkEnterMotionType(array);
                if (type && type === 'slow') {
                  return {
                    command: 'start motion slowly',
                    sid,
                  };
                } else if (type && type === 'quick') {
                  return {
                    command: 'start motion quickly',
                    sid,
                  };
                }

                break;
              }
              case 4: {
                if (isShortHold(array)) {
                  return {
                    command: 'short hold',
                    sid,
                  };
                }

                break;
              }
              case 3: {
                if (isTap(array)) {
                  return {
                    command: 'tap',
                    sid,
                  };
                }

                break;
              }
            }
          }

          return {
            command: 'none',
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
    map((values) => values.map((v) => v.command).reverse()),
  );
};

export const getLastCommandStream = () => {
  const { distinctUntilChanged, map, pairwise } = getRx().operators;

  return getMotionCommandStream().pipe(
    map((v) => v.command),
    distinctUntilChanged(),
    pairwise(),
  );
};
