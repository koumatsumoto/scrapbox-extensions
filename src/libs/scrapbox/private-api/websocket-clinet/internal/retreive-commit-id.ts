import { ExternalCommitResponsePayload, ExternalResponsePayload } from '../types/response';

const isExternalCommitResponse = (response: ExternalResponsePayload): response is ExternalCommitResponsePayload => response[0] === 'commit';
export const tryRetrieveCommitData = (response: ExternalResponsePayload) => {
  return isExternalCommitResponse(response) ? response[1] : null;
};
