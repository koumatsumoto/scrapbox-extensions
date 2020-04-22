import { getRx } from '../../../common';
import { ID } from '../../public-api';
import { CommitChangeParam, createChanges } from './internal/commit-change-param';
import { parseMessage } from './internal/parse-message';
import { tryRetrieveCommitData } from './internal/retreive-commit-id';
import { validateResponse } from './internal/validate-response';
import { CommitRequestPayload, JoinRoomRequestPayload, WebsocketRequestPayload } from './types/request';
import {
  CommitSuccessResponsePayload,
  ConnectionOpenResponsePayload,
  DeprecatedWebsocketSendResponsePayload,
  ExternalCommitData,
  ExternalResponsePayload,
  JoinRoomSuccessResponsePayload,
} from './types/response';

const endpoint = 'wss://scrapbox.io/socket.io/?EIO=3&transport=websocket';
const sendProtocol = '42';
const receiveProtocol = '43';
// own impl
type ResponseEmission = { senderId: string; data: DeprecatedWebsocketSendResponsePayload };

export class DeprecatedWebsocketClient {
  private readonly socket: WebSocket;
  // need buffer if try to send until connection opened
  private sendBuffer: Function[] = [];
  private senderId = 0;
  private readonly _externalCommit$ = new (getRx().Subject)<ExternalCommitData | null>();
  readonly response$ = new (getRx().Subject)<ResponseEmission>();
  readonly open$ = new (getRx().Subject)<Event>();
  readonly close$ = new (getRx().Subject)<CloseEvent>();
  readonly error$ = new (getRx().Subject)<Event>();
  readonly commitIdUpdate$ = this._externalCommit$
    .asObservable()
    .pipe(getRx().operators.filter(((v) => v !== null) as (v: ExternalCommitData | null) => v is ExternalCommitData));

  constructor(private readonly userId: ID) {
    this.socket = new WebSocket(endpoint);
    this.initialize();
  }

  commit(param: { projectId: string; userId: ID; pageId: string; parentId: string; changes: CommitChangeParam[] }) {
    return this.send({
      method: 'commit',
      data: {
        kind: 'page',
        userId: this.userId,
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

  private async send(payload: CommitRequestPayload): Promise<CommitSuccessResponsePayload[]>;
  private async send(payload: JoinRoomRequestPayload): Promise<JoinRoomSuccessResponsePayload[]>;
  private async send(payload: WebsocketRequestPayload): Promise<any> {
    const body = JSON.stringify(['socket.io-request', payload]);
    const sid = `${this.senderId++}`;
    const data = `${sendProtocol}${sid}${body}`;

    if (this.socket.readyState !== WebSocket.OPEN) {
      this.sendBuffer.push(() => this.socket.send(data));
    } else {
      this.socket.send(data);
    }

    const response = await this.response$
      .pipe(
        getRx().operators.first(({ senderId }) => senderId === sid),
        getRx().operators.map((res) => res.data),
      )
      .toPromise<DeprecatedWebsocketSendResponsePayload>();
    // throw if error
    validateResponse(response);

    return response;
  }

  /**
   * Connect to websocket and register events.
   */
  private initialize() {
    this.socket.addEventListener('open', (event: Event) => {
      console.log('[websocket-client] connection opened ', event);
      this.open$.next(event);
    });

    this.socket.addEventListener('message', (event: MessageEvent) => {
      if (typeof event.data !== 'string') {
        throw new Error('unexpected data received');
      }

      const message = event.data;
      const [header, data] = parseMessage(message);

      // message just after connection opened
      if (header === '0') {
        this.setPingAndConsumeBuffer(data as ConnectionOpenResponsePayload);
      }
      // updation by other user
      if (header === '42') {
        this._externalCommit$.next(tryRetrieveCommitData(data as ExternalResponsePayload));
      }
      // for own send() result
      if (header.startsWith(receiveProtocol)) {
        const senderId = header.slice(receiveProtocol.length);
        this.response$.next({ senderId, data: data as any });
      }
    });

    this.socket.addEventListener('close', (event: CloseEvent) => {
      // maybe closed by server
      console.error('[websocket-client] connection closed ', event);
      this.close$.next(event);
    });

    this.socket.addEventListener('error', (event: Event) => {
      console.error('[websocket-client] connection errored ', event);
      this.error$.next(event);
      this.socket.close();
    });
  }

  private setPingAndConsumeBuffer(data: ConnectionOpenResponsePayload) {
    // setup ping
    setInterval(() => {
      this.socket.send('2');
    }, data.pingInterval);

    // consume buffer
    this.sendBuffer.forEach((f) => f());
    this.sendBuffer = [];
  }
}
