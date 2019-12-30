import { getChange } from './get-change';

describe('getChange', () => {
  it('should calculate values as expected', () => {
    expect(
      getChange(
        {
          acceleration: {
            x: 0,
            y: 0,
            z: 0,
          },
          accelerationIncludingGravity: {
            x: 0,
            y: 0,
            z: 0,
          },
          rotationRate: {
            alpha: 0,
            beta: 0,
            gamma: 0,
          },
          interval: 0,
        },
        {
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
        },
      ),
    ).toEqual({
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
    });
  });
});
