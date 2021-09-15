import { ScrapboxApi } from 'scrapbox-tools/';

const hasPageTitleOf = (names: string[]) => (element: HTMLElement) => {
  const title = element.querySelector('.title')?.textContent ?? '';

  return names.includes(title);
};

/**
 * Remove settings and user pages from first loaded list items
 */
export const hideSettingsAndUserPages = async ({ scrapboxApi }: { scrapboxApi: ScrapboxApi }) => {
  const user = await scrapboxApi.getUser();

  const pageListItemElements = Array.from(document.querySelectorAll<HTMLElement>('.page-list .page-list-item'));
  pageListItemElements.filter(hasPageTitleOf([user.name, 'settings'])).forEach((element) => {
    element.style.display = 'none';
  });
};
