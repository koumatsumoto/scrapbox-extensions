import { componentManager } from '../component-manager';
import { MyDebugBoard } from '../../components';
import {
  getDeviceOrientationManipulationSetStream,
  getOrientationAndMotionDebugString,
  getOrientationAndMotionSummary,
} from '../../libs/common/deviceorientation-and-devicemotion';

export const useDebugBoard = () => {
  const debugBoard = componentManager.getInstance(MyDebugBoard);

  let data: any;
  let debugText = '';
  // getOrientationAndMotionSummary().subscribe((d) => (data = d));
  getDeviceOrientationManipulationSetStream().subscribe((d) => (data = d));
  getOrientationAndMotionDebugString().subscribe((d) => (debugText = d));

  const loop = () => {
    if (data && debugText) {
      const json = JSON.stringify(data, null, 2);
      debugBoard.setText(json, 'left');
      debugBoard.setText(debugText, 'right');
    }
    window.requestAnimationFrame(loop);
  };
  loop();
};
