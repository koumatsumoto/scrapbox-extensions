import { ScrapboxApi } from 'scrapbox-tools/';
import { listItemSelectorFn } from './config';

const settingsPageName = 'settings';
const retrieveTitle = (e: HTMLElement) => {
  const t = e.querySelector('.title');

  return t ? t.textContent || '' : '';
};

/**
 * Remove settings and user pages from first loaded list items
 */
export const removeSettingsAndUserPages = async ({ scrapboxApi }: { scrapboxApi: ScrapboxApi }) => {
  const user = await scrapboxApi.getUser();

  for (const e of listItemSelectorFn()) {
    const title = retrieveTitle(e);
    if (title === user.name || title === settingsPageName) {
      e.style.display = 'none';
    }
  }
};
