import { parse } from './parser';

export const styleLines = <Line extends { id: string; text: string }>(lines: Line[]) => {
  const parsedResults = parse(lines);

  parsedResults.forEach((data) => {
    document.getElementById(data.elementId)!.dataset['lineType'] = data.lineType;
  });
};
