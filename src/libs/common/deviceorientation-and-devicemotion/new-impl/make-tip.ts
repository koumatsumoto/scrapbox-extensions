import { MotionClassification } from './aggregate';
import { CommandTypes } from './to-command';

type State = {
  // used for double tip, shake
  remainCount: number;
  tip: number;
  /**
   * 0: searching tip start signal
   * 1: checking next value after tip start signal
   * 2: waiting for next steady to start searching next tip
   */
  mode: 0 | 1 | 2;
  tipPosition: number[];
  tipOnce: boolean;
  doubletipCheckCount: number;
  // prev to curr
  tipDirection: 'up' | 'down' | null;
};

const createState = (): State => ({
  // updated and used for double tip and shake action
  remainCount: 100,
  tip: 0,
  mode: 0,
  tipPosition: [],
  tipOnce: false,
  doubletipCheckCount: 2,
  tipDirection: null,
});

export const makeTip = (values: MotionClassification[]): CommandTypes => {
  const state = createState();
  for (let i = 1; i < values.length; i++) {
    const current = values[i];
    const previous = values[i - 1];

    if (current.rate > 2 && previous.rate < 2) {
      const direction = current.direction;
      if (state.tipOnce && state.tipDirection === direction) {
        return 'double tip';
      }

      state.tipOnce = true;
      state.tipDirection = direction;
      continue;
    }

    if (state.tipOnce && --state.doubletipCheckCount < 0) {
      return 'tip';
    }
  }

  if (state.tipOnce) {
    return state.doubletipCheckCount > 0 ? 'tip expecting next' : 'tip';
  }

  return 'nothing';
};
