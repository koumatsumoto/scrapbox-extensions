import { WebsocketClient } from '../../libs/scrapbox/private-api';

const projectId = '5dc685a50fc39d0017e27559';

export const enablePrivateApi = () => {
  // debug
  const client = new WebsocketClient({ projectId });
  (window as any).client = client;
};
