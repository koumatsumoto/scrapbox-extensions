import { DynamicConfig } from '../../config';

export const tagOptions: DynamicConfig['tags'] = [
  { name: 'S', type: 'condition' },
  { name: 'T', type: 'condition' },
  { name: 'A', type: 'affection' },
  { name: 'B', type: 'affection' },
  { name: '読書', type: 'activity' },
  { name: '聴楽', type: 'activity' },
  { name: '視聴', type: 'activity' },
  { name: '閲覧', type: 'activity' },
  { name: '会話', type: 'activity' },
  { name: '開発', type: 'activity' },
  { name: '想起', type: 'intention' },
  { name: '学習', type: 'intention' },
  { name: '着想', type: 'intention' },
];

export const allTagWords = tagOptions.map((tag) => tag.name);
