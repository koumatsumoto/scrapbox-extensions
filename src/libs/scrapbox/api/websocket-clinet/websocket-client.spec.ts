import { WebsocketClient } from './websocket-client';

describe('a', () => {
  test('b', async (done) => {
    const socket = new WebsocketClient();
    setTimeout(() => {
      console.log('[dev]', socket);
      done();
    }, 5000);
  });
});
