import { componentManager } from '../component-manager';
import { MyDebugBoard } from '../../components';
import { getDeviceMotionChangeStream } from '../../libs/common/devicemotion/get-devicemotion-stream';

export const useDebugBoard = () => {
  const debugBoard = componentManager.getInstance(MyDebugBoard);
  const motionWithChange$ = getDeviceMotionChangeStream();

  motionWithChange$.subscribe((data) => {
    debugBoard.updateText(JSON.stringify(data, null, 2));
  });
};
