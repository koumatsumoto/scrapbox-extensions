import { Observable } from 'rxjs';
import { getRx } from '../rxjs';
import { isEntireDeviceMotionEvent } from './is-entire-device-motion-event';
import { simplifyValue } from './simplify-value';
import { EntireDeviceMotionDataWithChange, EntireDeviceMotionData } from './types';
import { getChange } from './get-change';

export const getDeviceMotionStream = () => {
  const Subject = getRx().Subject;
  const subject = new Subject<DeviceMotionEvent>();

  window.addEventListener('devicemotion', (e: DeviceMotionEvent) => {
    subject.next(e);
  });

  return subject.asObservable();
};

/**
 *
 * @param source - for testing
 */
export const getDeviceMotionChangeStream = (source: Observable<DeviceMotionEvent> = getDeviceMotionStream()) => {
  const { filter, map, scan, skip } = getRx().operators;

  return source.pipe(
    filter(isEntireDeviceMotionEvent),
    map((e) => simplifyValue(e)),
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
          change: getChange(state.data, val),
        };
      }
    }, null),
    skip(1),
  );
};
