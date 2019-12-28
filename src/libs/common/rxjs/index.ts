/**
 * window.rxjs is loaded by external script
 **/
import * as Rx from 'rxjs';
import * as operators from 'rxjs/operators';

export type RxJS = {
  Subject: typeof Rx.Subject;
  operators: {
    filter: typeof operators.filter;
  };
};

declare global {
  interface Window {
    rxjs: RxJS;
  }
}

export const Subject = window.rxjs.Subject;
