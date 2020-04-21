import { isTagLine } from '../../../../libs/scrapbox/public-api/scrapbox-object/line';
import { ScrapboxLine } from '../../../../libs/scrapbox/types';
import { Memory, Name } from '../types';

export type TitleBlock = {
  type: 'title';
  of: Memory['name'];
  lines: [ScrapboxLine];
};

export type SemantemeBlock = {
  type: 'semanteme';
  of: Memory['name'];
  lines: ScrapboxLine[];
};

export type EpisodeBlock = {
  type: 'episode';
  of: Memory['name'];
  lines: ScrapboxLine[];
};

export type Block = TitleBlock | SemantemeBlock | EpisodeBlock;

// scrapbox.Page.lines.map((l) => ({ n: l.section.number, t: l.text }))
export const makeBlocks = (lines: ScrapboxLine[]) => {
  const blocks: Block[] = [];
  // iteration point
  let cursor = 0;
  // head is title-line
  const titleLine = lines[cursor];
  const getNewBlock = (type: 'semanteme' | 'episode'): SemantemeBlock | EpisodeBlock => ({ of: titleLine.text as Name, type, lines: [] });

  // title block
  blocks.push({
    type: 'title',
    of: titleLine.text as Name,
    lines: [titleLine],
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
    }

    block.lines.push(line);
  }

  blocks.push(block);

  return blocks;
};
