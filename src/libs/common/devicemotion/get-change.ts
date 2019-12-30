import { DeviceMotionChange, EntireDeviceMotionData } from './types';

export const getChange = (prev: EntireDeviceMotionData, curr: EntireDeviceMotionData): DeviceMotionChange => ({
  acceleration: {
    x: curr.acceleration.x - prev.acceleration.x,
    y: curr.acceleration.y - prev.acceleration.y,
    z: curr.acceleration.z - prev.acceleration.z,
  },
  accelerationIncludingGravity: {
    x: curr.accelerationIncludingGravity.x - prev.accelerationIncludingGravity.x,
    y: curr.accelerationIncludingGravity.y - prev.accelerationIncludingGravity.y,
    z: curr.accelerationIncludingGravity.z - prev.accelerationIncludingGravity.z,
  },
  rotationRate: {
    alpha: curr.rotationRate.alpha - prev.rotationRate.alpha,
    beta: curr.rotationRate.beta - prev.rotationRate.beta,
    gamma: curr.rotationRate.gamma - prev.rotationRate.gamma,
  },
});
