import { tagOptions } from './config';
import { openDialog } from './dialog';

const addButton = () => {
  window.scrapbox.PageMenu.addItem({
    title: 'my-test-button',
    onClick: async () => {
      try {
        const selectedTags = await openDialog({ tagOptions });

        await navigator.clipboard.writeText('');
      } catch (e) {
        alert(e);
      }
    },
  });
};

export const insertBlockUi = () => {
  addButton();
};
