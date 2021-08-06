import { getGlobalObject } from '../global-object';
import { listItemSelectorFn } from './config';

const settingsPageName = 'settings';
const retrieveTitle = (e: HTMLElement) => {
  const t = e.querySelector('.title');

  return t ? t.textContent || '' : '';
};

/**
 * Remove settings and user pages from first loaded list items
 */
export const removeSettingsAndUserPages = async () => {
  const { scrapboxClient } = await getGlobalObject();
  const user = await scrapboxClient.getUser();

  for (const e of listItemSelectorFn()) {
    const title = retrieveTitle(e);
    if (title === user.name || title === settingsPageName) {
      e.style.display = 'none';
    }
  }
};
