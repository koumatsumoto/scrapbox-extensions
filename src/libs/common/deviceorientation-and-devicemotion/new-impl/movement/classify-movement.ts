import { CombinedValue } from './combine';

type Threshold = {
  high: number;
  mid: number;
  low: number;
  // equalize values if under
  // TODO: consider rename to steady
  round: number;
};

// TODO: make generalize for other types like as alpha, beta, x, y, z
export const defaultThreshold: Threshold = {
  high: 100,
  mid: 40,
  low: 20,
  round: 10,
};

export type Movement = {
  direction: 'up' | 'down';
  // stopping, slightly, low, mid, high
  rate: 0 | 1 | 2 | 3 | 4;
  // all direction of value change is same
  align: boolean;
};

const calcRate = (value: number, threshold: Threshold) => {
  if (value > threshold.high) {
    return 4;
  } else if (value > threshold.mid) {
    return 3;
  } else if (value > threshold.low) {
    return 2;
  } else if (value > threshold.round) {
    return 1;
  } else {
    return 0;
  }
};

export const classify = (a: CombinedValue, threshold: Threshold = defaultThreshold): Movement => {
  if (a.first < a.last) {
    // up
    const rate = calcRate(a.last - a.first, threshold);
    const align = a.count === a.increase;

    return {
      direction: 'up',
      rate,
      align,
    };
  } else if (a.first > a.last) {
    // down
    const rate = calcRate(a.first - a.last, threshold);
    const align = a.count === a.decrease;

    return {
      direction: 'down',
      rate,
      align,
    };
  } else {
    let betweenPositive: number;
    let betweenNegative: number;
    if (a.first > 0) {
      betweenPositive = a.max - a.first;
      betweenNegative = a.min > 0 ? a.first - a.min : Math.abs(a.min - a.first);
    } else {
      betweenPositive = a.max < 0 ? Math.abs(a.first + a.max) : a.max - a.first;
      betweenNegative = Math.abs(a.min + a.first);
    }

    return {
      direction: betweenPositive > betweenNegative ? 'up' : 'down',
      rate: 0,
      align: a.first === a.max && a.first === a.min,
    };
  }
};
