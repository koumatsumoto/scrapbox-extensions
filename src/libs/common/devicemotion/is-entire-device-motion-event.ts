import { EntireDeviceMotionEvent } from './types';

export const isEntireDeviceMotionEvent = (e: DeviceMotionEvent): e is EntireDeviceMotionEvent => {
  const a = e.acceleration;
  if (a === null || a.x === null || a.y === null || a.z === null) {
    return false;
  }

  const g = e.accelerationIncludingGravity;
  if (g === null || g.x === null || g.y === null || g.z === null) {
    return false;
  }

  const r = e.rotationRate;
  if (r === null || r.alpha === null || r.beta === null || r.gamma === null) {
    return false;
  }

  return true;
};
