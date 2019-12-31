import { componentManager } from '../component-manager';
import { MyDebugBoard } from '../../components';
import { getOrientationAndMotionSummary } from '../../libs/common/deviceorientation-and-devicemotion';

export const useDebugBoard = () => {
  const debugBoard = componentManager.getInstance(MyDebugBoard);

  let data: object | undefined;
  getOrientationAndMotionSummary().subscribe((d) => (data = d));

  const loop = () => {
    if (data) {
      debugBoard.updateText(JSON.stringify(data, null, 2));
    }
    window.requestAnimationFrame(loop);
  };
  loop();
};
