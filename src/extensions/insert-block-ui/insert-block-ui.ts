const addButton = () => {
  window.scrapbox.PageMenu.addItem({
    title: 'my-test-button',
    onClick: async () => {
      try {
        const text = 'be copied';
        await navigator.clipboard.writeText(text);
        const copied = await navigator.clipboard.readText();
        alert(copied);
      } catch (e) {
        alert(e);
      }
    },
  });
};

export const insertBlockUi = () => {
  addButton();
};
