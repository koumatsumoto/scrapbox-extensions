import { ScrapboxDomManipulator } from '../../util/scrapbox-dom';

const addButton = () => {
  window.scrapbox.PageMenu.addItem({
    title: 'my-test-button',
    onClick: () => {
      ScrapboxDomManipulator.pasteToEditor();
      navigator.clipboard.readText().then((v) => alert(v));
    },
  });
};

export const insertBlockUi = () => {
  addButton();
};
