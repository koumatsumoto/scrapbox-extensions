import { Brand } from '../../../libs/common';
import { ID } from '../../../libs/scrapbox/public-api';

// can integrate its information into Φ (ii)
export type Phiable<A> = A & {
  Φ: (
    data: A,
  ) => {
    value: number;
    rank: number;
  };
};

// ideation name that is bracketed in text of line e.g. [Page Name]
export type Name = Brand<string, 'Name'>;

// ii: differentiate by type
export type Tag = Phiable<{
  name: Name;
  type: 'date' | 'time' | 'feeling' | 'activity' | 'ideation';
}>;

// ii: integrate tags
export type Context = Phiable<{
  tags: Tag[];
}>;

// made from Scrapbox.Page.lines
// ii:
// - length of text
// - count of bracketed words in text
export type Line = Phiable<{
  id: ID;
  text: string;
}>;

// data passes to next episode;
export type Information = Phiable<{
  // parent context + ideation name at current position
  context: Context;
  // can 0
  lines: Line[];
}>;

export type Link = {
  information: Information;
  // parent episode
  from: Episode;
  // destination
  to: (ideation: Name, information: Information) => () => Promise<Episode>;
};

// Episodic-Memory
export type Episode = Phiable<{
  // where episode belongs to
  of: Memory;
  // have an array of tag
  context: Context;
  // all lines in episode block
  lines: Line[];
  // null if root-episode
  parent: Link | null;
  // all references to linked to episode
  children: Link[];
}>;

// Semantic-Memory constructed by Episodic-Memories
export type Semanteme = Phiable<{
  lines: Line[];
  // time of last episode
  lastUpdatedTime: Date;
}>;

// construct from scrapbox.Page
// the node of episodes
export type Memory = Phiable<{
  symbol: Name;
  semanteme: Semanteme;
  episodes: Episode[];
}>;
