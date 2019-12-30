import { createTestingDeviceMotionEvent } from './test-helpers';
import { isEntireDeviceMotionEvent } from './is-entire-device-motion-event';

describe('isEntireDeviceMotionEvent', () => {
  it('should cond', () => {
    const i = isEntireDeviceMotionEvent;
    const c = createTestingDeviceMotionEvent;
    expect(i(c())).toBeTruthy();
    expect(i(c({ acceleration: { x: null } }))).toBeFalsy();
    expect(i(c({ acceleration: { y: null } }))).toBeFalsy();
    expect(i(c({ acceleration: { z: null } }))).toBeFalsy();
    expect(i(c({ accelerationIncludingGravity: { x: null } }))).toBeFalsy();
    expect(i(c({ accelerationIncludingGravity: { y: null } }))).toBeFalsy();
    expect(i(c({ accelerationIncludingGravity: { z: null } }))).toBeFalsy();
    expect(i(c({ rotationRate: { alpha: null } }))).toBeFalsy();
    expect(i(c({ rotationRate: { beta: null } }))).toBeFalsy();
    expect(i(c({ rotationRate: { gamma: null } }))).toBeFalsy();
  });
});
