import { ReceivedMessage } from './ws-types';

const endpoint = 'wss://scrapbox.io/socket.io/?EIO=3&transport=websocket';

const createJoinRoomMessage = (param: { projectId: string }) => {
  const payload = [
    'socket.io-request',
    {
      method: 'room:join',
      data: {
        pageId: null,
        projectId: param.projectId,
        projectUpdatesStream: false,
      },
    },
  ];

  return `420${JSON.stringify(payload)}`;
};

const createCommitMessage = (param: {}) => {
  const protocol = '42';
  const payload = [
    'socket.io-request',
    {
      method: 'commit',
      data: {
        kind: 'page',
        parentId: '5e21ff0a81473900178b8ee1',
        changes: [
          {
            _insert: '_end',
            lines: {
              id: '5e220a82e275580000dd9271',
              text: '',
            },
          },
          {
            _update: '5e21ff0ae27558000073d57d',
            lines: {
              text: '',
            },
          },
        ],
        cursor: null,
        pageId: '5ddfb0cef0f4dd0017d4a219',
        userId: '5dc685a50fc39d0017e27558',
        projectId: '5dc685a50fc39d0017e27559',
        freeze: true,
      },
    },
  ];

  return `${protocol}${payload}`;
};

// 430[{...}}] => 430, [{}]
const extractMessage = (message: string): [string, ReceivedMessage] => {
  let protocol = '';
  while (message.length) {
    const head = message[0];
    // remove head if it is numeric char (part of protocol)
    if (Number.isInteger(Number.parseInt(head))) {
      protocol += head;
      message = message.substr(1);
    } else {
      return [protocol, JSON.parse(message) as ReceivedMessage];
    }
  }

  return [protocol, null];
};

export class WebsocketClient {
  private readonly socket: WebSocket;

  constructor(private readonly option: { projectId: string }) {
    this.socket = new WebSocket(endpoint);
    this.initialize();
  }

  private sendJoinRoom() {
    this.send(createJoinRoomMessage({ projectId: this.option.projectId }));
  }

  private send(message: string) {
    // TODO: validate connection status, this.socket.OPEN

    this.socket.send(message);
  }

  /**
   * Connect to websocket and register events.
   */
  private initialize() {
    this.socket.addEventListener('open', (event: Event) => {
      console.log('[websocket-client] connection opened ', event);
      this.sendJoinRoom();
    });

    this.socket.addEventListener('message', (event: MessageEvent) => {
      if (typeof event.data !== 'string') {
        throw new Error('unexpected data received');
      }

      console.log('[debug] ws message', event.data);
      const message = event.data;
      const [protocol, data] = extractMessage(message);
      console.log('[debug] extracted', data);
    });

    this.socket.addEventListener('close', (event: CloseEvent) => {
      // maybe closed by server
      console.error('[websocket-client] connection closed ', event);
    });

    this.socket.addEventListener('error', (event: any) => {
      console.error('[websocket-client] connection errored ', event);
    });
  }
}

// debug
const client = new WebsocketClient({ projectId: '5dc685a50fc39d0017e27559' });
(window as any).client = client;
