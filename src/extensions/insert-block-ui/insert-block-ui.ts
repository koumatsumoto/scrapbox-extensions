const addButton = () => {
  window.scrapbox.PageMenu.addItem({
    title: 'my-test-button',
    onClick: () => {
      navigator.clipboard.readText().then((v) => alert(v));
    },
  });
};

export const insertBlockUi = () => {
  addButton();
};
