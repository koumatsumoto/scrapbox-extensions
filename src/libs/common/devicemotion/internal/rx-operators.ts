import { Observable } from 'rxjs';
import { DeviceMotion, DeviceMotionWithChange } from '../types';
import { diff } from './get-change';
import { getRx } from '../../rxjs';
import { calculateAverage } from './calculate-average';

export const withChange = () => (source: Observable<DeviceMotion>) => {
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
          change: diff(state.data, val),
        };
      }
    }, null),
    skip(1),
  ) as Observable<DeviceMotionWithChange>;
};

export const toAverage = (countToAverage: number) => (source: Observable<DeviceMotion>) => {
  const { bufferCount, map } = getRx().operators;

  return source.pipe(
    bufferCount(countToAverage),
    map((changes: DeviceMotion[]) => calculateAverage(changes)),
  );
};
