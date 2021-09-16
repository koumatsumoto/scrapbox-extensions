import { ScrapboxApi, UserScriptApi } from 'scrapbox-tools';
import { SxButton } from '../../libs';
import { handleFormAndDialog } from './handle-form-and-dialog';

export const addContentsButton = ({ scrapboxApi, config }: { scrapboxApi: ScrapboxApi; config: Record<string, unknown> }) => {
  const tagOptions = config['tags'] as { name: string; type: string }[]; // TODO(fix): correct types

  const button = new SxButton({ type: 'flat' });
  button.innerText = 'Add Note';
  button.style.marginTop = '32px';
  button.addEventListener('click', (ev) => {
    ev.stopPropagation();
    handleFormAndDialog({ scrapboxApi, tagOptions }).catch(window.alert);
  });

  // for page bottom
  UserScriptApi.pageContainerElement.appendChild(button);
};
