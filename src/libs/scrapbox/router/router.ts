import { patchWindowHistoryApiAndGetEventStream } from './internal/patch-window-history-api-and-get-event-stream';
import { distinctUntilChanged } from 'rxjs/operators';
import { isSameUrl } from './internal/predicate';

export class Router {
  private readonly stream = patchWindowHistoryApiAndGetEventStream();

  get urlChange() {
    return this.stream.asObservable().pipe(distinctUntilChanged(isSameUrl))
  }
}
