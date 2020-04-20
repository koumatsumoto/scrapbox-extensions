import { isTagLine } from '../../../../libs/scrapbox/public-api/scrapbox-object/line';
import { Line } from '../../../../libs/scrapbox/types';

export type TitleBlock = {
  type: 'title';
  lines: Line[];
};

export type SemantemeBlock = {
  type: 'semanteme';
  lines: Line[];
};

export type EpisodeBlock = {
  type: 'episode';
  lines: Line[];
};

export type Block = TitleBlock | SemantemeBlock | EpisodeBlock;

const getNewBlock = (type: Block['type']): Block => ({ type, lines: [] });

// scrapbox.Page.lines.map((l) => ({ n: l.section.number, t: l.text }))
export const makeBlocks = (lines: Line[]) => {
  const blocks: Block[] = [];
  // iteration point
  let cursor = 0;

  // title block
  blocks.push({
    type: 'title',
    // head is title-line
    lines: [lines[cursor]],
  });
  if (cursor === lines.length) {
    return blocks;
  }

  // semanteme block
  const semantemeBlock = getNewBlock('semanteme');
  for (cursor = 1; cursor < lines.length; cursor++) {
    const line = lines[cursor];
    if (isTagLine(line)) {
      break;
    } else {
      blocks.push(semantemeBlock);
    }
  }
  if (cursor === lines.length) {
    return blocks;
  }

  let block = getNewBlock('episode');
  // this line is specified as tag-line above
  block.lines.push(lines[cursor++]);

  for (; cursor < lines.length; cursor++) {
    const line = lines[cursor];
    if (isTagLine(line)) {
      blocks.push(block);
      block = getNewBlock('episode');
    } else {
      block.lines.push(line);
    }
  }

  blocks.push(block);

  return blocks;
};
