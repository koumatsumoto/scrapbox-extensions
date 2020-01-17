import { WebsocketClient } from '../../libs/scrapbox/private-api';
const projectId = '5d5b7c3fcf67b30017947699';

export const enablePrivateApi = () => {
  const client = new WebsocketClient({ projectId });
  console.log(client);
};
