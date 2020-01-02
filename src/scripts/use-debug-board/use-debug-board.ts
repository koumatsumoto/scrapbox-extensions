import { componentManager } from '../component-manager';
import { MyDebugBoard } from '../../components';
import { getOrientationAndMotionDebugString } from '../../libs/common/deviceorientation-and-devicemotion';
import {
  getCommandHistoryStream,
  getLastCommandStream,
} from '../../libs/common/deviceorientation-and-devicemotion/new-impl/get-motion-set-stream';

export const useDebugBoard = () => {
  const debugBoard = componentManager.getInstance(MyDebugBoard);

  let data: string;
  let data2: string[];
  let debugText = '';
  getLastCommandStream().subscribe((d) => (data = d));
  getCommandHistoryStream().subscribe((d) => (data2 = d));
  getOrientationAndMotionDebugString().subscribe((d) => (debugText = d));

  const loop = () => {
    if (data && data2 && debugText) {
      debugBoard.setText(JSON.stringify(data, null, 2), 'left-top');
      debugBoard.setText(JSON.stringify(data2, null, 2), 'left-bot');
      debugBoard.setText(debugText, 'right-bot');
    }
    window.requestAnimationFrame(loop);
  };
  loop();
};
