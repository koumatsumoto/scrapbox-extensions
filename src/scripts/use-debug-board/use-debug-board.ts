import { componentManager } from '../component-manager';
import { MyDebugBoard } from '../../components';
import { getOrientationAndMotionStream } from '../../libs/common/deviceorientation-and-devicemotion';

export const useDebugBoard = () => {
  const debugBoard = componentManager.getInstance(MyDebugBoard);
  const $ = getOrientationAndMotionStream();

  let orientationAndMotion: any = {};
  $.subscribe((d) => {
    orientationAndMotion = d;
  });

  const loop = () => {
    debugBoard.updateText(JSON.stringify(orientationAndMotion, null, 2));
    window.requestAnimationFrame(loop);
  };
  loop();
};
