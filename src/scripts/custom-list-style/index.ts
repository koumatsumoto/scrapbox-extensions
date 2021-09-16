import { isString } from 'lodash-es';
import { DynamicConfig, ScrapboxApi } from 'scrapbox-tools';
import { customTagTextStyleInPageLink } from './custom-tag-text-style-in-page-link';
import { hideSettingsAndUserPages } from './hide-settings-and-user-pages';
import { setDefaultImage } from './set-default-image';
import { showLastUpdatedTime } from './show-last-updated-time';

import './style.scss';

export const customListStyle = async ({ scrapboxApi, dynamicConfig }: { scrapboxApi: ScrapboxApi; dynamicConfig: DynamicConfig }) => {
  const config = await dynamicConfig.data;

  customTagTextStyleInPageLink();
  hideSettingsAndUserPages({ scrapboxApi }).catch(console.error);

  if (isString(config['defaultListItemImage'])) {
    setDefaultImage({ imageUrl: config['defaultListItemImage'] });
  }

  if (config['showLastUpdatedTimeInListItem']) {
    showLastUpdatedTime();
  }
};
