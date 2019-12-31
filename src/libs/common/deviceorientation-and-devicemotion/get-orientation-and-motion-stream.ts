import { getDeviceMotionStream } from './devicemotion';
import { getDeviceOrientationStream } from './deviceorientation/get-device-orientation-stream';
import { getRx } from '../rxjs';

export const getOrientationAndMotionStream = () => {
  const { withLatestFrom } = getRx().operators;
  const orientation$ = getDeviceOrientationStream();
  const motion$ = getDeviceMotionStream();

  return orientation$.pipe(withLatestFrom(motion$));
};
