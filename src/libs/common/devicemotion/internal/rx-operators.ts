import { Observable } from 'rxjs';
import { EntireDeviceMotionData, EntireDeviceMotionDataWithChange } from '../types';
import { getChange } from './get-change';
import { getRx } from '../../rxjs';

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
  );
};
