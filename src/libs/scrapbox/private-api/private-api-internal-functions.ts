import { ID } from '../public-api';
import {
  CommitChange,
  createDeletionChange,
  createDescriptionChange,
  createInsertionChange,
  createTitleChange,
  createUpdationChange,
} from './websocket-clinet/internal/commit-change';

type InsertChangeParam = { type: 'insert'; id: ID; position?: ID; text: string };
type UpdateChangeParam = { type: 'update'; id: ID; text: string };
type DeleteChangeParam = { type: 'delete'; id: ID };
type TitleChangeParam = { type: 'title'; title: string };
type DescriptionChangeParam = { type: 'description'; text: string };
export type ChangeParam = InsertChangeParam | UpdateChangeParam | DeleteChangeParam | TitleChangeParam | DescriptionChangeParam;

export const createChange = (param: ChangeParam): CommitChange => {
  if (param.type === 'insert') {
    return createInsertionChange(param);
  } else if (param.type === 'update') {
    return createUpdationChange(param);
  } else if (param.type === 'delete') {
    return createDeletionChange(param);
  } else if (param.type === 'title') {
    return createTitleChange(param);
  } else {
    return createDescriptionChange(param);
  }
};

export const createChanges = (params: ChangeParam[]): CommitChange[] => params.map(createChange);
