import { Observable } from 'rxjs';
import { getRx } from '../rxjs';
import { isEntireDeviceMotionData } from './internal/is-entire-device-motion-data';
import { Precision, simplifyValue } from './internal/simplify-value';
import { EntireDeviceMotionDataWithChange, EntireDeviceMotionData, DeviceMotionData } from './types';
import { getChangePerMillisecond } from './internal/get-change';
import { calculateAverage } from './internal/calculate-average';

export const getDeviceMotionStream = () => {
  const Subject = getRx().Subject;
  const subject = new Subject<DeviceMotionData>();

  window.addEventListener('devicemotion', (e: DeviceMotionEvent) => {
    subject.next(e as DeviceMotionData);
  });

  return subject.asObservable();
};

/**
 *
 * @param source - for testing
 */
export const getDeviceMotionWithChangeStream = (
  precision: Precision = 8,
  source: Observable<DeviceMotionData> = getDeviceMotionStream(),
) => {
  const { bufferCount, filter, map, scan, skip } = getRx().operators;

  return source.pipe(
    filter(isEntireDeviceMotionData),
    map((e) => simplifyValue(e, precision)),
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
      return calculateAverage(changes.map((c) => c.change));
    }),
  );
};
