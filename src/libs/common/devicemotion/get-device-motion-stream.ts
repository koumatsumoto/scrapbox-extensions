import { Observable } from 'rxjs';
import { getRx } from '../rxjs';
import { isEntireDeviceMotion } from './internal/is-entire-device-motion';
import { toInt } from './internal/to-int';
import { DeviceMotionWithChange, DeviceMotion, PartialDeviceMotion, Precision } from './types';
import { getChangePerMillisecond } from './internal/get-change';
import { calculateAverageAsInt } from './internal/calculate-average';
import { equalizeByThreshold, Threshold } from './internal/equalize-by.threshold';
import { toAverage, toInteger, withChange } from './internal/rx-operators';

export const getPartialDeviceMotionStream = () => {
  const Subject = getRx().Subject;
  const subject = new Subject<PartialDeviceMotion>();

  window.addEventListener('devicemotion', (e: DeviceMotionEvent) => {
    subject.next(e as PartialDeviceMotion);
  });

  return subject.asObservable();
};

export const getEntireDeviceMotionStream = () => {
  const { filter } = getRx().operators;

  return getPartialDeviceMotionStream().pipe(filter(isEntireDeviceMotion)) as Observable<DeviceMotion>;
};

export const getDeviceMotionWithChangeStream = (
  option: {
    precision?: Precision;
    scale?: Threshold;
  } = {},
  // for testing
  source: Observable<PartialDeviceMotion> = getPartialDeviceMotionStream(),
) => {
  const precision = option.precision || 8;
  const scale = option.scale || 10000;
  const { bufferCount, filter, map, scan, skip } = getRx().operators;

  return source.pipe(
    filter(isEntireDeviceMotion),
    map((e) => toInt(e, precision)),
    scan<DeviceMotion, DeviceMotionWithChange, null>((state, val) => {
      if (state === null) {
        // should be skipped, change is wrong
        return {
          data: val,
          change: val,
        };
      } else {
        return {
          data: val,
          change: getChangePerMillisecond(state.data, val),
        };
      }
    }, null),
    skip(1),
    // TODO: consider parameterize
    bufferCount(10),
    map((changes: DeviceMotionWithChange[]) => {
      const avg = calculateAverageAsInt(changes.map((c) => c.change));

      return equalizeByThreshold(avg, scale);
    }),
  );
};

export const getNewDeviceMotionWithChangeStream = (
  option: {
    averageDenominator?: number;
    precision?: Precision;
    scale?: Threshold;
  } = {},
  // for testing
  source: Observable<DeviceMotion> = getEntireDeviceMotionStream(),
) => {
  return source.pipe(toAverage(option.averageDenominator), toInteger(option.precision), withChange());
};
