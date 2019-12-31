import { Observable } from 'rxjs';
import { DeviceMotionChange, EntireDeviceMotionData, EntireDeviceMotionDataWithChange } from '../types';
import { getChange } from './get-change';
import { getRx } from '../../rxjs';
import { calculateAverage } from './calculate-average';

export const makeChange = () => (source: Observable<EntireDeviceMotionData>) => {
  const { scan, skip } = getRx().operators;

  return source.pipe(
    scan<EntireDeviceMotionData, EntireDeviceMotionDataWithChange, null>((state, val) => {
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
  ) as Observable<EntireDeviceMotionDataWithChange>;
};

export const toAverage = (countToAverage: number) => (source: Observable<DeviceMotionChange>) => {
  const { bufferCount, map } = getRx().operators;

  return source.pipe(
    bufferCount(countToAverage),
    map((changes: DeviceMotionChange[]) => calculateAverage(changes)),
  );
};
