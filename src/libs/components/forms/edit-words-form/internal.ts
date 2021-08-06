import { groupBy } from 'lodash';

const makeCheckbox = (tag: { name: string; type: string }) => {
  return `<input is="sx-checkbox" type="checkbox" name="tags" value="${tag.name}" label="${tag.name}">`;
};
const makeCheckboxesRow = (row: [type: string, tags: { name: string; type: string }[]]) => {
  return `<div class="checkbox-row" data-row-type="${row[0]}">${row[1].map(makeCheckbox).join('')}</div>`;
};

export const makeCheckboxesContainer = (tags: { name: string; type: string }[]) => {
  return Object.entries(groupBy(tags, (tag) => tag.type))
    .map(makeCheckboxesRow)
    .join('');
};
