import { waitUntil } from '../../../common';
import { ID } from '../../public-api';
import { extractMessage } from './websocket-client-internal-functions';
import { CommitChange, ConnectionOpenMessage, Protocol, ReceivedMessage, SendMessage } from './websocket-client-types';

const endpoint = 'wss://scrapbox.io/socket.io/?EIO=3&transport=websocket';
const sendProtocol = '42';
const websocketResponseTimeoutMs = 1000 * 30;

export class WebsocketClient {
  private readonly socket: WebSocket;
  // need buffer if try to send until connection opened
  private sendBuffer: Function[] = [];
  private senderId = 0;
  /**
   * if map.get(key) === undefined, message sent and response unreceived
   * if map.get(key) !== undefined, message sent and response received
   */
  private receivePool = new Map<Protocol, ReceivedMessage | undefined>();

  constructor() {
    this.socket = new WebSocket(endpoint);
    this.initialize();
  }

  commit(param: { projectId: string; userId: ID; pageId: string; parentId: string; changes: CommitChange[] }) {
    this.send({
      method: 'commit',
      data: {
        kind: 'page',
        parentId: param.parentId,
        changes: param.changes,
        cursor: null,
        pageId: param.pageId,
        userId: param.userId,
        projectId: param.projectId,
        freeze: true,
      },
    });
  }

  joinRoom(param: { projectId: string; pageId: string }) {
    this.send({
      method: 'room:join',
      data: {
        pageId: param.pageId,
        projectId: param.projectId,
        projectUpdatesStream: false,
      },
    });
  }

  private async send(payload: SendMessage) {
    const body = JSON.stringify(['socket.io-request', payload]);
    const senderId = this.senderId++;
    const header = `${sendProtocol}${senderId}`;
    const data = `${header}${body}`;

    if (this.socket.readyState !== WebSocket.OPEN) {
      this.sendBuffer.push(() => this.socket.send(data));

      return;
    }

    this.socket.send(data);
    this.receivePool.set(header, undefined);
    await waitUntil(() => this.receivePool.get(header) !== undefined, 10, websocketResponseTimeoutMs);

    const result = this.receivePool.get(header);
    this.receivePool.delete(header);

    return result;
  }

  /**
   * Connect to websocket and register events.
   */
  private initialize() {
    this.socket.addEventListener('open', (event: Event) => {
      console.log('[websocket-client] connection opened ', event);
    });

    this.socket.addEventListener('message', (event: MessageEvent) => {
      if (typeof event.data !== 'string') {
        throw new Error('unexpected data received');
      }

      const message = event.data;
      const [header, body] = extractMessage(message);
      console.log('[websocket-client] message', header, body);

      // message just after connection opened
      if (header === '0') {
        this.handleOpen(body as ConnectionOpenMessage);
      }
      // for send()
      if (header.startsWith(sendProtocol)) {
        this.receivePool.set(header, body);
      }
    });

    this.socket.addEventListener('close', (event: CloseEvent) => {
      // maybe closed by server
      console.error('[websocket-client] connection closed ', event);
    });

    this.socket.addEventListener('error', (event: any) => {
      console.error('[websocket-client] connection errored ', event);
    });
  }

  private handleOpen(message: ConnectionOpenMessage) {
    // setup ping
    setInterval(() => {
      this.socket.send('2');
    }, message.pingInterval);

    // consume buffer
    this.sendBuffer.forEach((f) => f());
    this.sendBuffer = [];
  }
}
