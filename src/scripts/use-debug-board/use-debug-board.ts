import { componentManager } from '../component-manager';
import { MyDebugBoard } from '../../components';
import { getOrientationAndMotionDebugString } from '../../libs/common/deviceorientation-and-devicemotion';
import {
  getAggregationStream,
  getAggregationStreamForDebug,
} from '../../libs/common/deviceorientation-and-devicemotion/new-impl/get-motion-set-stream';

export const useDebugBoard = () => {
  const debugBoard = componentManager.getInstance(MyDebugBoard);

  let data: unknown;
  let data2: unknown;
  let debugText = '';
  getAggregationStream().subscribe((d) => (data = d));
  getAggregationStreamForDebug().subscribe((d) => (data2 = d));
  getOrientationAndMotionDebugString().subscribe((d) => (debugText = d));

  setInterval(() => {
    data2 = [];
  }, 1000 * 10);

  const loop = () => {
    if (data && data2 && debugText) {
      debugBoard.setText(JSON.stringify(data, null, 2), 'left-top');
      debugBoard.setText(JSON.stringify(data2, null, 2), 'right-top');
      debugBoard.setText(debugText, 'right-bot');
    }
    window.requestAnimationFrame(loop);
  };
  loop();
};
