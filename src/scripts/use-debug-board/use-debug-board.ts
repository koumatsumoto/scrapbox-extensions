import { getDeviceMotionStream } from '../../libs/common';
import { componentManager } from '../component-manager';
import { MyDebugBoard } from '../../components';

export const useDebugBoard = () => {
  const motion$ = getDeviceMotionStream();
  const debugBoard = componentManager.getInstance(MyDebugBoard);

  motion$.subscribe((e: DeviceMotionEvent) => {
    console.log(e);
    const acceleration = e.acceleration || ({} as any);
    const rotationRate = e.rotationRate || ({} as any);
    const interval = e.interval;

    debugBoard.updateText(
      JSON.stringify(
        {
          interval,
          acceleration: {
            x: acceleration.x,
            y: acceleration.y,
            z: acceleration.z,
          },
          rotationRate: {
            alpha: rotationRate.alpha,
            beta: rotationRate.beta,
            gamma: rotationRate.gamma,
          },
        },
        null,
        2,
      ),
    );
  });
};
