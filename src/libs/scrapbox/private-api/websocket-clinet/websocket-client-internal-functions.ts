import { generateId, ID } from '../../others';
import {
  CommitChange,
  DeleteCommitChange,
  InsertCommitChange,
  Protocol,
  ProtocolAndPayload,
  ReceivedMessage,
  UpdateCommitChange,
} from './websocket-client-types';

export const createJoinRoomMessage = (param: { projectId: string; pageId: string }) => {
  const payload = [
    'socket.io-request',
    {
      method: 'room:join',
      data: {
        pageId: param.pageId,
        projectId: param.projectId,
        projectUpdatesStream: false,
      },
    },
  ];

  return `420${JSON.stringify(payload)}`;
};

export const createCommitMessage = (param: {
  projectId: string;
  userId: string;
  pageId: string;
  parentId: string;
  changes: CommitChange[];
}) => {
  const protocol = '421';
  const payload = [
    'socket.io-request',
    {
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
    },
  ];

  return `${protocol}${JSON.stringify(payload)}`;
};

export const createInsertionChange = (param: { userId: ID; position: ID | '_end'; text: string }): InsertCommitChange => {
  return {
    _insert: param.position,
    lines: {
      id: generateId(param.userId),
      text: param.text,
    },
  };
};

export const createUpdationChange = (param: { id: ID; text: string }): UpdateCommitChange => {
  return {
    _update: param.id,
    lines: {
      text: param.text,
    },
  };
};

export const createDeletionChange = (param: { id: ID }): DeleteCommitChange => {
  return {
    _delete: param.id,
    lines: -1,
  };
};

// 430[{...}}] => 430, [{}]
export const extractMessage = (message: string): ProtocolAndPayload => {
  let protocol = '';
  while (message.length) {
    const head = message[0];
    // remove head if it is numeric char (part of protocol)
    if (Number.isInteger(Number.parseInt(head))) {
      protocol += head;
      message = message.substr(1);
    } else {
      return [protocol as Protocol, JSON.parse(message) as ReceivedMessage];
    }
  }

  return [protocol as Protocol, null];
};
