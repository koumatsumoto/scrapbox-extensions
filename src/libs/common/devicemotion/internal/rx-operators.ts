import { Observable } from 'rxjs';
import { DeviceMotionValue, DeviceMotion, DeviceMotionWithChange } from '../types';
import { getChange } from './get-change';
import { getRx } from '../../rxjs';
import { calculateAverage } from './calculate-average';

export const makeChange = () => (source: Observable<DeviceMotion>) => {
  const { scan, skip } = getRx().operators;

  return source.pipe(
    scan<DeviceMotion, DeviceMotionWithChange, null>((state, val) => {
      if (state === null) {
        return {
          data: val,
          // must be skipped below, skip(1)
          change: undefined as any,
        };
      } else {
        return {
          data: val,
          change: getChange(state.data, val),
        };
      }
    }, null),
    skip(1),
  ) as Observable<DeviceMotionWithChange>;
};

export const toAverage = (countToAverage: number) => (source: Observable<DeviceMotionValue>) => {
  const { bufferCount, map } = getRx().operators;

  return source.pipe(
    bufferCount(countToAverage),
    map((changes: DeviceMotionValue[]) => calculateAverage(changes)),
  );
};
