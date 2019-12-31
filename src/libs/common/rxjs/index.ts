/**
 * window.rxjs is loaded by external script
 **/
import * as RxType from 'rxjs';
import * as operatorsType from 'rxjs/operators';

export type RxJS = {
  animationFrameScheduler: typeof RxType.animationFrameScheduler;
  combineLatest: typeof RxType.combineLatest;
  Subject: typeof RxType.Subject;
  operators: {
    debounceTime: typeof operatorsType.debounceTime;
    bufferCount: typeof operatorsType.bufferCount;
    filter: typeof operatorsType.filter;
    map: typeof operatorsType.map;
    scan: typeof operatorsType.scan;
    skip: typeof operatorsType.skip;
  };
};

declare global {
  interface Window {
    rxjs: RxJS;
  }
}

// lazy load
export const getRx = () => window.rxjs as RxJS;
export * from './import-rxjs';
