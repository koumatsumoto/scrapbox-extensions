import { groupBy } from 'fp-ts/NonEmptyArray';
import { DynamicConfigTag } from '../../config';

const groupByType = groupBy((tag: DynamicConfigTag) => tag.type);
const toRecordByType = (tags: DynamicConfigTag[]) => groupByType(tags);
export const makeCheckboxesHTML = (tags: DynamicConfigTag[]) => {
  let labelId = 0;

  let html = '';
  for (const [type, items] of Object.entries(toRecordByType(tags))) {
    html += `<div class="tag-group ${type}">`;
    for (const tag of items) {
      const id = `tag-${labelId++}`;
      html += `<input is="sx-checkbox" type="checkbox" name="tags" value="${tag.name}" label="${tag.name}">`;
    }
    html += `</div>`;
  }

  return html;
};
