import { EntireDeviceMotionData } from '../types';

export type Precision = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const toInt = (v: number, exponentiation: number) => {
  return Number.parseInt((v * exponentiation).toFixed(0));
};

export const toInteger = (data: EntireDeviceMotionData, precision: Precision = 8): EntireDeviceMotionData => {
  const e = 10 ** precision;

  return {
    interval: data.interval,
    acceleration: {
      x: toInt(data.acceleration.x, e),
      y: toInt(data.acceleration.y, e),
      z: toInt(data.acceleration.z, e),
    },
    accelerationIncludingGravity: {
      x: toInt(data.accelerationIncludingGravity.x, e),
      y: toInt(data.accelerationIncludingGravity.y, e),
      z: toInt(data.accelerationIncludingGravity.z, e),
    },
    rotationRate: {
      alpha: toInt(data.rotationRate.alpha, e),
      beta: toInt(data.rotationRate.beta, e),
      gamma: toInt(data.rotationRate.gamma, e),
    },
  };
};
