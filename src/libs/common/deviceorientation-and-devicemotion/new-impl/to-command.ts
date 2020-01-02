import { MotionTypes } from './aggregate';

// TODO: not implemented
export type Command = 'tip' | 'double tip' | 'nothing' | 'waiting' | 'checking double tip';

export const toCommand = (motionTypes: MotionTypes[]): Command => {
  if (motionTypes.length < 2) {
    return 'nothing';
  }

  let expectLeftToRight = false;
  let expectRightToLeft = false;
  let ignoreCount = 0;
  const resetMode = () => {
    expectLeftToRight = false;
    expectRightToLeft = false;
    ignoreCount = 0;
  };

  let tipCount = 0;

  for (let i = 0; i < motionTypes.length; i++) {
    const type = motionTypes[i];

    // no mode determined
    if (!expectLeftToRight && !expectRightToLeft) {
      if (type === 'left to right') {
        expectRightToLeft = true;
      } else if (type === 'right to left') {
        expectLeftToRight = true;
      }

      continue;
    }

    // expect right to left mode
    if (expectRightToLeft) {
      ignoreCount++;

      if (ignoreCount > 2) {
        resetMode();
        continue;
      }

      if (type === 'right to left') {
        tipCount++;
        resetMode();
      }

      continue;
    }

    // expect left to right mode
    if (expectLeftToRight) {
      ignoreCount++;

      if (ignoreCount > 2) {
        resetMode();
        continue;
      }

      if (type === 'left to right') {
        tipCount++;
        resetMode();
      }
    }
  }

  switch (true) {
    case tipCount === 1: {
      return 'tip';
    }
    case tipCount === 2: {
      return 'double tip';
    }
    default: {
      return 'nothing';
    }
  }
};
