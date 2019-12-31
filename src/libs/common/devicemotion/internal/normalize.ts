import { DeviceMotionAsTuple, DeviceMotionValue, ValueAndChange } from '../types';
import { toInt } from '../../arithmetic';

// Assuming devicemotion values are calculated as integer
export type Threshold = 10 | 100 | 1000 | 10000 | 100000 | 1000000;

// @deprecated - old impl
export const deprecatedNormalizeByThreshold = (val: DeviceMotionValue, t: Threshold) => ({
  acceleration: {
    x: toInt(val.acceleration.x / t),
    y: toInt(val.acceleration.y / t),
    z: toInt(val.acceleration.z / t),
  },
  accelerationIncludingGravity: {
    x: toInt(val.accelerationIncludingGravity.x / t),
    y: toInt(val.accelerationIncludingGravity.y / t),
    z: toInt(val.accelerationIncludingGravity.z / t),
  },
  rotationRate: {
    alpha: toInt(val.rotationRate.alpha / t),
    beta: toInt(val.rotationRate.beta / t),
    gamma: toInt(val.rotationRate.gamma / t),
  },
});

const defaultThreshold = {
  acceleration: 10000,
  accelerationIncludingGravity: 10000,
  rotationRate: 10000,
} as const;

export type ThresholdOption = typeof defaultThreshold;

const calc = (v: [number, number], threshold: number) => [toInt(v[0] / threshold), toInt(v[1] / threshold)] as ValueAndChange;
export const normalize = (v: DeviceMotionAsTuple, t: ThresholdOption = defaultThreshold): DeviceMotionAsTuple => ({
  acceleration: {
    x: calc(v.acceleration.x, t.acceleration),
    y: calc(v.acceleration.y, t.acceleration),
    z: calc(v.acceleration.z, t.acceleration),
  },
  accelerationIncludingGravity: {
    x: calc(v.accelerationIncludingGravity.x, t.accelerationIncludingGravity),
    y: calc(v.accelerationIncludingGravity.y, t.accelerationIncludingGravity),
    z: calc(v.accelerationIncludingGravity.z, t.accelerationIncludingGravity),
  },
  rotationRate: {
    alpha: calc(v.rotationRate.alpha, t.rotationRate),
    beta: calc(v.rotationRate.beta, t.rotationRate),
    gamma: calc(v.rotationRate.gamma, t.rotationRate),
  },
});
