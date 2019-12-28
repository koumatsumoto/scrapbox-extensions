import { getDeviceMotionStream } from '../../libs/common';
import { componentManager } from '../component-manager';
import { MyDebugBoard } from '../../components';

const fixOrNull = (val: number | null) => {
  if (val === null) {
    return null;
  }

  return val.toFixed(3);
};

const formatDeviceMotionEvent = (e: DeviceMotionEvent) => {
  const acceleration = e.acceleration || ({} as any);
  const rotationRate = e.rotationRate || ({} as any);
  const interval = e.interval;

  return {
    interval,
    acceleration: {
      x: fixOrNull(acceleration.x),
      y: fixOrNull(acceleration.y),
      z: fixOrNull(acceleration.z),
    },
    rotationRate: {
      alpha: fixOrNull(rotationRate.alpha),
      beta: fixOrNull(rotationRate.beta),
      gamma: fixOrNull(rotationRate.gamma),
    },
  } as const;
};

export const useDebugBoard = () => {
  const motion$ = getDeviceMotionStream();
  const debugBoard = componentManager.getInstance(MyDebugBoard);

  motion$.subscribe((e: DeviceMotionEvent) => {
    const data = formatDeviceMotionEvent(e);

    debugBoard.updateText(JSON.stringify(data, null, 2));
  });
};
