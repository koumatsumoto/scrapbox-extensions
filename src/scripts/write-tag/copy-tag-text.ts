import { getDateText, getPrivateApi, isEmptyPage, makeTag } from '../../libs/scrapbox';
import { tagOptions } from './config';
import { openDialog } from './dialog';
import { getDateOrTimeText } from './get-date-or-time-text';

export const openDialogAndWriteTags = async () => {
  try {
    const [api, result] = await Promise.all([getPrivateApi(), openDialog({ tagOptions })]);

    if (result.ok) {
      const tagLineText = [getDateOrTimeText(), ...result.data].map(makeTag).join(' ');
      if (isEmptyPage()) {
        await api.updateTitle({ title: getDateText() });
        await api.updateDescription({ description: tagLineText });
      } else {
        await api.insertSingleLineIntoCurrentPage({ text: tagLineText });
      }
    }
  } catch (e) {
    alert(e);
  }
};
