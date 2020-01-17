const endpoint = 'wss://scrapbox.io/socket.io/?EIO=3&transport=websocket';

const getJoinRoomCommand = (param: { projectId: string }) => {
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

export class WebsocketClient {
  private socket: WebSocket | null = null;

  constructor(private readonly option: { projectId: string }) {
    this.initialize();
  }

  /**
   * Connect to websocket and register events.
   */
  private initialize() {
    const socket = new WebSocket(endpoint);

    socket.addEventListener('open', (event) => {
      socket.send(getJoinRoomCommand({ projectId: this.option.projectId }));
      console.log('open', event);
    });

    socket.addEventListener('message', (event: any) => {
      console.log('Message from server ', event.data);
    });

    socket.addEventListener('close', (event: any) => {
      console.log('server closed ', event.data);
    });

    socket.addEventListener('error', (event: any) => {
      console.log('server errored ', event.data);
    });

    this.socket = socket;
    // debug
    (window as any).socket = socket;
  }
}
