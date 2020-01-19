import { ApiClient } from './api-client';
import { WebsocketClient } from './websocket-client';
import { createUpdateSingleLineChange } from './websocket-client-internal-functions';

export class PrivateApi {
  constructor(private readonly userId: string, private readonly apiClient: ApiClient, private readonly websocketClient: WebsocketClient) {}

  async updateSingleLine(param: { projectId: string; pageId: string; commitId: string; lineId: string; text: string }) {
    this.websocketClient.commit({
      userId: this.userId,
      projectId: param.projectId,
      pageId: param.pageId,
      parentId: param.commitId,
      changes: [
        createUpdateSingleLineChange({
          id: param.lineId,
          text: param.text,
        }),
      ],
    });
  }

  async updateSingleLineOfCurrentPage(param: { lineId: string; text: string }) {
    const [project, page] = await Promise.all([this.apiClient.getCurrentProject(), this.apiClient.getCurrentPage()]);

    this.updateSingleLine({
      ...param,
      projectId: project.id,
      pageId: page.id,
      commitId: page.commitId,
    });
  }
}

export const getPrivateApi = async () => {
  const apiClient = new ApiClient();
  const [user, project, page] = await Promise.all([apiClient.getMe(), apiClient.getCurrentProject(), apiClient.getCurrentPage()]);
  const websocketClient = new WebsocketClient();
  websocketClient.joinRoom({ projectId: project.id, pageId: page.id });

  return new PrivateApi(user.id, apiClient, websocketClient);
};
