import { MotionTypes } from './aggregate';

// TODO: not implemented
export type Command = string;

export const toCommand = (motionTypes: MotionTypes[]): void => {
  for (const t of motionTypes) {
    if (t === 'neutral') {
      continue;
    }
  }
};
