/**
 * Used in partially supported device
 */
export type PartialDeviceMotion = {
  readonly interval: number;
  readonly acceleration: {
    readonly x: number | null;
    readonly y: number | null;
    readonly z: number | null;
  };
  readonly accelerationIncludingGravity: {
    readonly x: number | null;
    readonly y: number | null;
    readonly z: number | null;
  };
  readonly rotationRate: {
    readonly alpha: number | null;
    readonly beta: number | null;
    readonly gamma: number | null;
  };
};

/**
 * Used in full-supported device
 */
export type DeviceMotion = {
  readonly interval: number;
  readonly acceleration: {
    readonly x: number;
    readonly y: number;
    readonly z: number;
  };
  readonly accelerationIncludingGravity: {
    readonly x: number;
    readonly y: number;
    readonly z: number;
  };
  readonly rotationRate: {
    readonly alpha: number;
    readonly beta: number;
    readonly gamma: number;
  };
};

export type DeviceMotionValue = {
  acceleration: DeviceMotion['acceleration'];
  accelerationIncludingGravity: DeviceMotion['accelerationIncludingGravity'];
  rotationRate: DeviceMotion['rotationRate'];
};

export type DeviceMotionWithChange = {
  data: DeviceMotion;
  change: DeviceMotionValue;
};
