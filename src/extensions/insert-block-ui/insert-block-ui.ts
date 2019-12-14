import { makeTag } from '../../util/scrapbox';
import { tagOptions } from './config';
import { openDialog } from './dialog';
import { getDateOrTimeText } from './get-date-or-time-text';

const addButton = () => {
  window.scrapbox.PageMenu.addItem({
    title: 'my-test-button',
    onClick: async () => {
      try {
        const selectedTexts = await openDialog({ tagOptions });
        const tagText = [getDateOrTimeText(), ...selectedTexts].map(makeTag).join(' ');

        await navigator.clipboard.writeText(tagText);
      } catch (e) {
        alert(e);
      }
    },
  });
};

export const insertBlockUi = () => {
  addButton();
};
