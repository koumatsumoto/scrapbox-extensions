import { ID } from '../../public-api';
import { CommitChangeParam, createChanges } from './internal/commit-change-param';
import { parseMessage } from './internal/parse-message';
import { WebsocketRequestPayload, ConnectionOpenResponsePayload, WebsocketResponsePayload } from './types';

const endpoint = 'wss://scrapbox.io/socket.io/?EIO=3&transport=websocket';
const headers = {
  initialize: '0',
  ping: '2',
  pong: '3',
  connected: '40',
  // e.g.
  //   * 42: 'cursor'
  //   * 42X: user custom request (X is arbitrary natural number to specify response)
  send: '42',
  // e.g.
  //   * 43X: response to user custom request (X is number used for request)
  receive: '43',
};

type InternalMessage = { senderId: string | null; data: WebsocketResponsePayload };

class WebsocketEventTarget extends EventTarget {
  // when websocket connection established
  dispatchConnectionOpened(event: Event) {
    this.dispatchEvent(new CustomEvent('connection-opened', { detail: event }));
  }
  // when websocket connection closed
  dispatchConnectionClosed(event: CloseEvent) {
    this.dispatchEvent(new CustomEvent('connection-closed', { detail: event }));
  }
  // when websocket connection closed
  dispatchConnectionErrored(event: Event) {
    this.dispatchEvent(new CustomEvent('connection-errored', { detail: event }));
  }
  dispatchResponse(data: InternalMessage) {
    this.dispatchEvent(new CustomEvent('message-received', { detail: data }));
  }

  subscribe(type: 'message-received', listener: (e: CustomEvent<InternalMessage>) => void): void;
  subscribe(type: string, listener: (e: CustomEvent) => void): void {
    super.addEventListener(type, listener as any);
  }

  unsubscribe(type: 'message-received', listener: (e: CustomEvent<InternalMessage>) => void): void;
  unsubscribe(type: string, listener: (e: CustomEvent) => void): void {
    super.removeEventListener(type, listener as any);
  }
}

const awaitResponse = (emitter: WebsocketEventTarget, id: string) =>
  new Promise<WebsocketResponsePayload>((resolve, reject) => {
    const handle = (e: CustomEvent<InternalMessage>) => {
      if (e.detail.senderId === id) {
        resolve(e.detail.data);
        emitter.unsubscribe('message-received', handle);
      }
    };

    emitter.subscribe('message-received', handle);
    // timeout for memory leak
    setTimeout(() => {
      emitter.unsubscribe('message-received', handle);
      reject(new Error('[websocket-client] timeout for response'));
    }, 1000 * 30);
  });

export class WebsocketClient {
  private readonly socket: WebSocket;
  private readonly event: WebsocketEventTarget;

  // wait request until connection opened
  private pendingRequests: Function[] = [];
  private senderId = 0;

  constructor(socket?: WebSocket, event?: WebsocketEventTarget) {
    this.socket = socket || new WebSocket(endpoint);
    this.event = event || new WebsocketEventTarget();
    this.initialize();
  }

  commit(param: { projectId: string; userId: ID; pageId: string; parentId: string; changes: CommitChangeParam[] }) {
    return this.send({
      method: 'commit',
      data: {
        kind: 'page',
        userId: param.userId,
        projectId: param.projectId,
        pageId: param.pageId,
        parentId: param.parentId,
        changes: createChanges(param.changes, param.userId),
        cursor: null,
        freeze: true,
      },
    });
  }

  joinRoom(param: { projectId: string; pageId: string | null }) {
    return this.send({
      method: 'room:join',
      data: {
        pageId: param.pageId,
        projectId: param.projectId,
        projectUpdatesStream: false,
      },
    });
  }

  // unsubscribe is not implemented, no need currently
  subscribe(callback: (v: WebsocketResponsePayload) => unknown) {
    const fn = (e: CustomEvent<InternalMessage>) => callback(e.detail.data);
    this.event.subscribe('message-received', fn);
  }

  private async send(payload: WebsocketRequestPayload): Promise<WebsocketResponsePayload> {
    const body = JSON.stringify(['socket.io-request', payload]);
    const sid = `${this.senderId++}`;
    const data = `${headers.send}${sid}${body}`;

    if (this.socket.readyState !== WebSocket.OPEN) {
      this.pendingRequests.push(() => this.socket.send(data));
    } else {
      this.socket.send(data);
    }

    return awaitResponse(this.event, sid);
  }

  /**
   * Connect to websocket and register events.
   */
  private initialize() {
    this.socket.addEventListener('open', (ev) => this.event.dispatchConnectionOpened(ev));
    this.socket.addEventListener('close', (ev) => this.event.dispatchConnectionClosed(ev));
    this.socket.addEventListener('error', (ev) => this.event.dispatchConnectionErrored(ev));
    this.socket.addEventListener('message', (ev: MessageEvent) => this.handleMessage(ev));
  }

  // for incoming messages
  private handleMessage(event: MessageEvent) {
    if (typeof event.data !== 'string') {
      throw new Error('unexpected data received');
    }

    const message = event.data;
    const [header, data] = parseMessage(message);

    // message just after connection opened
    if (header === headers.initialize) {
      this.setPingAndConsumeBuffer(data as ConnectionOpenResponsePayload);
      return;
    }
    // for own send() result
    if (header.startsWith(headers.receive)) {
      const senderId = header.slice(headers.receive.length);
      this.event.dispatchResponse({ senderId, data: data });
      return;
    }
    // for updation by other users
    if (header === headers.send) {
      this.event.dispatchResponse({ senderId: null, data: data });
      return;
    }
  }

  private setPingAndConsumeBuffer(data: ConnectionOpenResponsePayload) {
    // ping interval is specified from server
    setInterval(() => this.socket.send('2'), data.pingInterval);

    // consume buffer
    this.pendingRequests.forEach((f) => f());
    this.pendingRequests = [];
  }
}
