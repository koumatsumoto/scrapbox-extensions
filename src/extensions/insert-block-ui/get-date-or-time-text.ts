import { getTimeText, getDateText } from '../../util/common';
import { getScrapboxPageType } from '../../util/scrapbox';

export const getDateOrTimeText = () => {
  const type = getScrapboxPageType();

  return type === 'diary' ? getDateText() : getTimeText();
};
