import { componentManager } from '../component-manager';
import { MyDebugBoard } from '../../components';
import { getDeviceMotionWithChangeStream } from '../../libs/common';

export const useDebugBoard = () => {
  const debugBoard = componentManager.getInstance(MyDebugBoard);
  const motionWithChange$ = getDeviceMotionWithChangeStream({ scale: 100000 });

  motionWithChange$.subscribe((data) => {
    debugBoard.updateText(
      JSON.stringify(
        {
          acceleration: data.acceleration,
          rotationRate: data.rotationRate,
        },
        null,
        2,
      ),
    );
  });
};
