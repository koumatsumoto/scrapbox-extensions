import { defaultImage } from './default-image';
import { highlightTags } from './highlight-tags';
import { removeSettingsAndUserPages } from './remove-settings-and-user-pages';
import { showDatetime } from './show-datetime';

export const main = () => {
  defaultImage();
  highlightTags();
  removeSettingsAndUserPages().catch(console.error);
  showDatetime();
};
