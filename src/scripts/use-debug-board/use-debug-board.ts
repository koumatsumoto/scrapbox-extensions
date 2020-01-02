import { componentManager } from '../component-manager';
import { MyDebugBoard } from '../../components';
import { getOrientationAndMotionDebugString } from '../../libs/common/deviceorientation-and-devicemotion';
import { getAggregationStream } from '../../libs/common/deviceorientation-and-devicemotion/new-impl/get-motion-set-stream';

export const useDebugBoard = () => {
  const debugBoard = componentManager.getInstance(MyDebugBoard);

  let data: unknown;
  let debugText = '';
  getAggregationStream().subscribe((d) => (data = d));
  getOrientationAndMotionDebugString().subscribe((d) => (debugText = d));

  const loop = () => {
    if (data && debugText) {
      debugBoard.setText(JSON.stringify(data, null, 2), 'left-top');
      debugBoard.setText(debugText, 'right-top');
    }
    window.requestAnimationFrame(loop);
  };
  loop();
};
