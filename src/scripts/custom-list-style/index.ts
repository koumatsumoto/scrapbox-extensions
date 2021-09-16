import { isString } from 'lodash-es';
import { ScrapboxApi } from 'scrapbox-tools';
import { customTagTextStyleInPageLink } from './custom-tag-text-style-in-page-link';
import { hideSettingsAndUserPages } from './hide-settings-and-user-pages';
import { setDefaultImage } from './set-default-image';
import { showLastUpdatedTime } from './show-last-updated-time';

import './style.scss';

export const customListStyle = ({ scrapboxApi, config }: { scrapboxApi: ScrapboxApi; config: Record<string, unknown> }) => {
  customTagTextStyleInPageLink();
  hideSettingsAndUserPages({ scrapboxApi }).catch(console.error);

  if (isString(config['defaultListItemImage'])) {
    setDefaultImage({ imageUrl: config['defaultListItemImage'] });
  }

  if (config['showLastUpdatedTimeInListItem']) {
    showLastUpdatedTime();
  }
};
