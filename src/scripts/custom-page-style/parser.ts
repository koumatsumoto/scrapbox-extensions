import { isStartsWithTag } from './predicates';

// id to dom starts with 'L' char because raw line-id can start with number char (it's invalid for dom)
export const getElementId = (lineId: string) => `L` + lineId;
export const getLineType = ({ line, index }: { line: { id: string; text: string }; index: number }) => {
  if (index === 0) {
    return 'title';
  }
  if (isStartsWithTag(line.text)) {
    return 'subheader';
  }

  return '';
};

export const parse = <Line extends { id: string; text: string }>(lines: Line[]) => {
  return lines.map((line, index) => {
    return {
      ...line,
      elementId: getElementId(line.id),
      lineType: getLineType({ line, index }),
    } as const;
  });
};
