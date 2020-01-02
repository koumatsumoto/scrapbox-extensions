import { componentManager } from '../component-manager';
import { MyDebugBoard } from '../../components';
import { getOrientationAndMotionDebugString } from '../../libs/common/deviceorientation-and-devicemotion';
import {
  getCommandHistoryStream,
  getLastCommandStream,
  getMotionAggregationsStream,
} from '../../libs/common/deviceorientation-and-devicemotion/new-impl/get-motion-set-stream';

export const useDebugBoard = () => {
  const debugBoard = componentManager.getInstance(MyDebugBoard);

  let data1: string;
  let data2: string[];
  let data3: unknown;
  let debugText = '';
  getLastCommandStream().subscribe((d) => (data1 = d));
  getCommandHistoryStream().subscribe((d) => (data2 = d));
  getMotionAggregationsStream().subscribe((d) => (data3 = d));
  getOrientationAndMotionDebugString().subscribe((d) => (debugText = d));

  const loop = () => {
    if (data1 && data2 && data3 && debugText) {
      debugBoard.setText(JSON.stringify(data1, null, 2), 'left-top');
      debugBoard.setText(JSON.stringify(data2, null, 2), 'left-bot');
      debugBoard.setText(JSON.stringify(data3, null, 2), 'right-top');
      debugBoard.setText(debugText, 'right-bot');
    }
    window.requestAnimationFrame(loop);
  };
  loop();
};
