import {
  CommitErrorResponsePayload,
  CommitResponsePayload,
  DeprecatedWebsocketSendResponsePayload,
  JoinRoomErrorResponsePayload,
  JoinRoomResponsePayload,
} from '../types/response';

const isCommitErrorResponse = (response: CommitResponsePayload | JoinRoomResponsePayload): response is CommitErrorResponsePayload => {
  return !!response.error && !Array.isArray(response.error.errors);
};

const isJoinRoomErrorResponse = (response: CommitResponsePayload | JoinRoomResponsePayload): response is JoinRoomErrorResponsePayload => {
  return !!response.error && Array.isArray(response.error.errors);
};

export const validateResponse = (response: DeprecatedWebsocketSendResponsePayload) => {
  for (const res of response) {
    if (isCommitErrorResponse(res)) {
      throw new Error(res.error.message);
    } else if (isJoinRoomErrorResponse(res)) {
      throw new Error(JSON.stringify(res.error.errors));
    }
  }
};
