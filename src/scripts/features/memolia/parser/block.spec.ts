import { makeBlocks } from './block';
import { data } from './test-data';

describe('episode', () => {
  test('makeEpisodeBlocks', () => {
    expect(makeBlocks(data as any).map((block) => block.type)).toEqual(['title', 'episode', 'episode']);
  });
});
