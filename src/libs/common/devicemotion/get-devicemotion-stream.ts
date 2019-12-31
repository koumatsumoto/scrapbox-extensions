import { Observable } from 'rxjs';
import { getRx } from '../rxjs';
import { isEntireDeviceMotionData } from './internal/is-entire-device-motion-data';
import { Precision, toInteger } from './internal/to-integer';
import { EntireDeviceMotionDataWithChange, DeviceMotionData } from './types';
import { calculateAverage } from './internal/calculate-average';
import { equalizeByThreshold, Threshold } from './internal/equalize-by.threshold';
import { makeChange } from './internal/rx-operators';

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
  const { bufferCount, filter, map } = getRx().operators;

  return source.pipe(
    filter(isEntireDeviceMotionData),
    map((e) => toInteger(e, precision)),
    makeChange(),
    // TODO: consider parameterize
    bufferCount(10),
    map((changes: EntireDeviceMotionDataWithChange[]) => {
      const avg = calculateAverage(changes.map((c) => c.change));

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
