import { Subject } from 'rxjs';
import { extract, filterAndExtract } from './rx-operators';
import { createTestingPartialDeviceOrientation } from '../../test-helpers';

describe('rx-operators', () => {
  describe('extract', () => {
    it('should make expected data', (done: Function) => {
      const $ = new Subject<DeviceOrientationEvent>();
      const orientation = createTestingPartialDeviceOrientation();

      setTimeout(() => {
        $.next({
          ...orientation,
          shouldBeStriped: '',
        } as any);
      });

      $.pipe(extract()).subscribe((data) => {
        expect(data).toEqual(orientation);
        done();
      });
    });
  });

  describe('filterAndExtract', () => {
    it('should make expected data', (done: Function) => {
      const $ = new Subject<DeviceOrientationEvent>();
      const ignored = createTestingPartialDeviceOrientation({ alpha: null }) as DeviceOrientationEvent;
      const passed = createTestingPartialDeviceOrientation({ alpha: 0 }) as DeviceOrientationEvent;

      setTimeout(() => {
        $.next(ignored);
        $.next(passed);
      });

      $.pipe(filterAndExtract()).subscribe((data) => {
        expect(data).toEqual(passed);
        done();
      });
    });
  });
});
