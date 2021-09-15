import { ScrapboxApi } from 'scrapbox-tools';
import { defaultImage } from './default-image';
import { highlightTags } from './highlight-tags';
import { removeSettingsAndUserPages } from './remove-settings-and-user-pages';
import { showDatetime } from './show-datetime';

export const main = ({ scrapboxApi }: { scrapboxApi: ScrapboxApi }) => {
  defaultImage();
  highlightTags();
  removeSettingsAndUserPages({ scrapboxApi }).catch(console.error);
  showDatetime();
};
