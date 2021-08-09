import { UserScriptApi } from 'scrapbox-tools';
import { openAlert, SxButton } from '../../libs';
import { handleFormAndDialog } from './handle-form-and-dialog';

export const main = () => {
  const button = new SxButton({ type: 'flat' });
  button.innerText = 'Add Note';
  button.style.marginTop = '32px';
  button.addEventListener('click', (ev) => {
    ev.stopPropagation();
    handleFormAndDialog().catch(openAlert);
  });

  // for page bottom
  UserScriptApi.pageContainerElement.appendChild(button);
};
