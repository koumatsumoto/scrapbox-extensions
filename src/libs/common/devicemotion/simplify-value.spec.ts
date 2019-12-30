import { simplifyValue } from './simplify-value';

describe('simplifyValue', () => {
  it('should calculate values as expected', () => {
    expect(
      simplifyValue({
        acceleration: {
          x: 0.00001,
          y: 0.0001,
          z: 0.001,
        },
        accelerationIncludingGravity: {
          x: 0.01,
          y: 0.1,
          z: 0,
        },
        rotationRate: {
          alpha: 1,
          beta: 10,
          gamma: 100,
        },
        interval: 0,
      }),
    ).toEqual({
      acceleration: {
        x: 0,
        y: 1,
        z: 10,
      },
      accelerationIncludingGravity: {
        x: 100,
        y: 1000,
        z: 0,
      },
      rotationRate: {
        alpha: 10000,
        beta: 100000,
        gamma: 1000000,
      },
      interval: 0,
    });
  });
});
