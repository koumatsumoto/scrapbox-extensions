import { makeBlocks } from './block';

describe('makeEpisodeBlocks', () => {
  const data = [
    {
      id: '5deb14496a04390017ea793f',
      text: 'Title',
      userId: '5dc685a50fc39d0017e27558',
      created: 1575687250,
      updated: 1575773276,
      title: true,
      section: {
        number: 0,
        start: true,
        end: false,
      },
    },
    {
      id: '5deb1491e27558000042e43e',
      text: '#tag1 #tag2',
      userId: '5dc685a50fc39d0017e27558',
      created: 1575687313,
      updated: 1587375433,
      section: {
        number: 0,
        start: false,
        end: false,
      },
      nodes: [
        {
          type: 'hashTag',
          unit: {
            page: 'tag1',
            tag: '#',
            content: 'tag1',
            whole: '#tag1',
          },
          children: '#tag1',
        },
        [
          ' ',
          {
            type: 'hashTag',
            unit: {
              page: 'tag2',
              tag: '#',
              content: 'tag2',
              whole: '#tag2',
            },
            children: '#tag2',
          },
        ],
      ],
    },
    {
      id: '5deb14aae27558000042e440',
      text: 'text next tag-line',
      userId: '5dc685a50fc39d0017e27558',
      created: 1575687338,
      updated: 1587375443,
      section: {
        number: 0,
        start: false,
        end: false,
      },
      nodes: 'text next tag-line',
    },
    {
      id: '5e9d6d53e275580000cdb12c',
      text: '',
      userId: '5dc685a50fc39d0017e27558',
      created: 1587375444,
      updated: 1587375444,
      section: {
        number: 0,
        start: false,
        end: true,
      },
      nodes: '',
    },
    {
      id: '5e9d6d53e275580000cdb12d',
      text: '#tag3 #tag4',
      userId: '5dc685a50fc39d0017e27558',
      created: 1587375444,
      updated: 1587375462,
      section: {
        number: 1,
        start: true,
        end: false,
      },
      nodes: [
        {
          type: 'hashTag',
          unit: {
            page: 'tag3',
            tag: '#',
            content: 'tag3',
            whole: '#tag3',
          },
          children: '#tag3',
        },
        [
          ' ',
          {
            type: 'hashTag',
            unit: {
              page: 'tag4',
              tag: '#',
              content: 'tag4',
              whole: '#tag4',
            },
            children: '#tag4',
          },
        ],
      ],
    },
    {
      id: '5e9d6d4be275580000cdb12a',
      text: 'text next tag-line',
      userId: '5dc685a50fc39d0017e27558',
      created: 1587375436,
      updated: 1587375467,
      section: {
        number: 1,
        start: false,
        end: false,
      },
      nodes: 'text next tag-line',
    },
    {
      id: '5e9d6d4ce275580000cdb12b',
      text: '',
      userId: '5dc685a50fc39d0017e27558',
      created: 1587375436,
      updated: 1587375436,
      section: {
        number: 1,
        start: false,
        end: true,
      },
      nodes: '',
    },
  ];

  test('should work', () => {
    expect(makeBlocks(data as any).map((block) => block.type)).toEqual(['title', 'episode', 'episode']);
  });
});
