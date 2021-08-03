import { SxDialogComponent } from './dialog.component';

export default {
  title: 'SxDialogComponent',
  component: SxDialogComponent,
};

let dialog: SxDialogComponent;

const getContents = () => {
  const div = document.createElement('div');
  div.innerHTML = `
  <header>Dialog Title</header>
  <div>Dialog Contents</div>
  <footer>
    <button data-close-dialog>Close Dialog</button>
  </footer>
  `;

  return div;
};

export const OpenDialog = () => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.innerText = 'Open Dialog';
  btn.addEventListener('click', () => {
    dialog = new SxDialogComponent({ contents: getContents() });
    dialog.open();
  });
  return btn;
};
