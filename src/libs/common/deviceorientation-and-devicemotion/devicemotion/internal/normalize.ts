import { DeviceMotionAsTuple, ValueAndChange } from '../../types';
import { floorToInt } from '../../../arithmetic';

const defaultThreshold = {
  acceleration: 10000000,
  accelerationIncludingGravity: 10000000,
  rotationRate: 100000000,
} as const;

export type ThresholdOption = {
  acceleration: number;
  accelerationIncludingGravity: number;
  rotationRate: number;
};

const calc = (v: [number, number], threshold: number) => [floorToInt(v[0] / threshold), floorToInt(v[1] / threshold)] as ValueAndChange;
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
