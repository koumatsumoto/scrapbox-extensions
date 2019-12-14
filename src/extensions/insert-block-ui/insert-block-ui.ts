import { ScrapboxDomManipulator } from '../../util/scrapbox-dom';

const addButton = () => {
  window.scrapbox.PageMenu.addItem({
    title: 'my-test-button',
    onClick: async () => {
      try {
        const text = 'be copied';
        await navigator.clipboard.writeText(text);
        const copied = await navigator.clipboard.readText();
        ScrapboxDomManipulator.pasteToEditor();
      } catch (e) {
        alert(e);
      }
    },
  });
};

export const insertBlockUi = () => {
  addButton();
};
