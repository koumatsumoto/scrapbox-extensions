const addButton = () => {
  window.scrapbox.PageMenu.addItem({
    title: 'my-test-button',
    onClick: () => {
      alert('hello');
    },
  });
};

export const insertBlockUi = () => {
  addButton();
};
