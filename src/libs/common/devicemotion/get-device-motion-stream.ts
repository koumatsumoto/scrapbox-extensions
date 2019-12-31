import { Observable } from 'rxjs';
import { getRx } from '../rxjs';
import { isEntireDeviceMotionData } from './internal/is-entire-device-motion-data';
import { Precision, toInteger } from './internal/to-integer';
import { DeviceMotionWithChange, DeviceMotion, PartialDeviceMotion } from './types';
import { getChangePerMillisecond } from './internal/get-change';
import { calculateAverageAsInt } from './internal/calculate-average';
import { equalizeByThreshold, Threshold } from './internal/equalize-by.threshold';

export const getPartialDeviceMotionStream = () => {
  const Subject = getRx().Subject;
  const subject = new Subject<PartialDeviceMotion>();

  window.addEventListener('devicemotion', (e: DeviceMotionEvent) => {
    subject.next(e as PartialDeviceMotion);
  });

  return subject.asObservable();
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
    filter(isEntireDeviceMotionData),
    map((e) => toInteger(e, precision)),
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
    precision?: Precision;
    scale?: Threshold;
  } = {},
  // for testing
  source: Observable<PartialDeviceMotion> = getPartialDeviceMotionStream(),
) => {
  const precision = option.precision || 8;
  const scale = option.scale || 10000;
  const { bufferCount, filter, map, scan, skip } = getRx().operators;

  return source.pipe(filter(isEntireDeviceMotionData), bufferCount(4));
};
