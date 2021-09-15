import { ScrapboxApi } from 'scrapbox-tools';
import { customTagTextStyleInPageLink } from './custom-tag-text-style-in-page-link';
import { hideSettingsAndUserPages } from './hide-settings-and-user-pages';
import { setDefaultImage } from './set-default-image';
import { showDatetime } from './show-datetime';

import './style.scss';

export const customListStyle = ({ scrapboxApi }: { scrapboxApi: ScrapboxApi }) => {
  setDefaultImage();
  customTagTextStyleInPageLink();
  hideSettingsAndUserPages({ scrapboxApi }).catch(console.error);
  showDatetime();
};
