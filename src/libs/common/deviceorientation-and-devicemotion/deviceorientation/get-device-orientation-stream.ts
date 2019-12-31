import { getRx } from '../../rxjs';
import { DeviceOrientation, PartialDeviceOrientation } from '../types';
import { Observable } from 'rxjs';
import { isEntireDeviceOrientation } from './internal/is-entire-device-orientation';

export const getPartialDeviceOrientationStream = () => {
  const Subject = getRx().Subject;
  const subject = new Subject<PartialDeviceOrientation>();

  window.addEventListener('deviceorientation', (e: DeviceOrientationEvent) => {
    subject.next(e);
  });

  return subject.asObservable();
};

export const getDeviceOrientationStream = () => {
  const { filter } = getRx().operators;

  return getPartialDeviceOrientationStream().pipe(filter(isEntireDeviceOrientation)) as Observable<DeviceOrientation>;
};
