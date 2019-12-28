import { getDeviceMotionStream, getRx } from '../../libs/common';
import { componentManager } from '../component-manager';
import { MyDebugBoard } from '../../components';

const round = (val: number | null) => {
  if (val === null) {
    throw new Error('Unexpected Error, check filter function');
  }

  return Number.parseFloat(val.toFixed(2));
};

const hasValue = (e: DeviceMotionEvent) => {
  return e.acceleration !== null && e.acceleration.x !== null;
};

type MotionData = {
  interval: number;
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  rotationRate: {
    alpha: number;
    beta: number;
    gamma: number;
  };
};

type ScanedData = {
  raw: MotionData;
  diff: {
    x: number;
    y: number;
    z: number;
    alpha: number;
    beta: number;
    gamma: number;
  };
};

const formatEvent = (e: DeviceMotionEvent) => {
  const acceleration = e.acceleration!;
  const rotationRate = e.rotationRate!;
  const interval = e.interval;

  return {
    interval,
    acceleration: {
      x: round(acceleration.x),
      y: round(acceleration.y),
      z: round(acceleration.z),
    },
    rotationRate: {
      alpha: round(rotationRate.alpha),
      beta: round(rotationRate.beta),
      gamma: round(rotationRate.gamma),
    },
  } as MotionData;
};

export const useDebugBoard = () => {
  const debugBoard = componentManager.getInstance(MyDebugBoard);
  const motion$ = getDeviceMotionStream();
  const { filter, map, scan } = getRx().operators;

  motion$
    .pipe(
      filter(hasValue),
      map(formatEvent),
      scan((state: ScanedData, val: MotionData) => ({
        raw: val,
        diff: {
          x: val.acceleration.x - state.raw.acceleration.x,
          y: val.acceleration.y - state.raw.acceleration.y,
          z: val.acceleration.z - state.raw.acceleration.z,
          alpha: val.rotationRate.alpha - state.raw.rotationRate.alpha,
          beta: val.rotationRate.beta - state.raw.rotationRate.beta,
          gamma: val.rotationRate.gamma - state.raw.rotationRate.gamma,
        },
      })),
    )
    .subscribe((data: ScanedData) => {
      debugBoard.updateText(JSON.stringify(data, null, 2));
    });
};
