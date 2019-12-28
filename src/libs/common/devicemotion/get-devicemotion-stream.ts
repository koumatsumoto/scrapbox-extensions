import { Subject } from 'rxjs';

// Use singleton for performance
let subject: Subject<DeviceMotionEvent>;
export const getDeviceMotionStream = () => {
  if (subject) {
    return subject.asObservable();
  }

  subject = new Subject<DeviceMotionEvent>();

  window.addEventListener('devicemotion', (e: DeviceMotionEvent) => {
    subject!.next(e);
  });

  return subject.asObservable();
};
