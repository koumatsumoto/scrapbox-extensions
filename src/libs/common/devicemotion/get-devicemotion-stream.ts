import { Observable } from 'rxjs';
import { getRx } from '../rxjs';
import { isEntireDeviceMotionData } from './internal/is-entire-device-motion-data';
import { Precision, toInteger } from './internal/to-integer';
import { EntireDeviceMotionDataWithChange, EntireDeviceMotionData, DeviceMotionData } from './types';
import { getChangePerMillisecond } from './internal/get-change';
import { calculateAverageAsInt } from './internal/calculate-average';
import { equalizeByThreshold, Threshold } from './internal/equalize-by.threshold';

export const getDeviceMotionStream = () => {
  const Subject = getRx().Subject;
  const subject = new Subject<DeviceMotionData>();

  window.addEventListener('devicemotion', (e: DeviceMotionEvent) => {
    subject.next(e as DeviceMotionData);
  });

  return subject.asObservable();
};

export const getDeviceMotionWithChangeStream = (
  option: {
    precision?: Precision;
    scale?: Threshold;
  } = {},
  // for testing
  source: Observable<DeviceMotionData> = getDeviceMotionStream(),
) => {
  const precision = option.precision || 8;
  const scale = option.scale || 10000;
  const { bufferCount, filter, map, scan, skip } = getRx().operators;

  return source.pipe(
    filter(isEntireDeviceMotionData),
    map((e) => toInteger(e, precision)),
    scan<EntireDeviceMotionData, EntireDeviceMotionDataWithChange, null>((state, val) => {
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
    map((changes: EntireDeviceMotionDataWithChange[]) => {
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
  source: Observable<DeviceMotionData> = getDeviceMotionStream(),
) => {
  const precision = option.precision || 8;
  const scale = option.scale || 10000;
  const { bufferCount, filter, map, scan, skip } = getRx().operators;

  return source.pipe(filter(isEntireDeviceMotionData), bufferCount(4));
};
