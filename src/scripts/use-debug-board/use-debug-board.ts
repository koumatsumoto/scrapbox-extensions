import { componentManager } from '../component-manager';
import { MyDebugBoard } from '../../components';
import { getOrientationAndMotionDebugString } from '../../libs/common/deviceorientation-and-devicemotion';
import { getAggregationStream } from '../../libs/common/deviceorientation-and-devicemotion/new-impl/get-motion-set-stream';

export const useDebugBoard = () => {
  const debugBoard = componentManager.getInstance(MyDebugBoard);

  let d1: unknown;
  let d2: unknown;
  let debugText = '';
  getAggregationStream().subscribe((d) => (d2 = d));
  getOrientationAndMotionDebugString().subscribe((d) => (debugText = d));

  const loop = () => {
    if (d1 && d2 && debugText) {
      debugBoard.setText(JSON.stringify(d1, null, 2), 'left-top');
      debugBoard.setText(JSON.stringify(d2, null, 2), 'left-bot');
      debugBoard.setText(debugText, 'right-top');
    }
    window.requestAnimationFrame(loop);
  };
  loop();
};
