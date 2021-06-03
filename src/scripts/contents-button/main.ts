import { ScrapboxScriptApi } from '../../libs';
import { createElement } from '../../libs/common/dom';
import { openAlert } from '../../libs/common/logger';
import { handleFormAndDialog } from './handle-form-and-dialog';

const createAddEpisodeButton = () => {
  return createElement({
    tag: 'button',
    contents: 'Add Contents',
    class: 'sx-add-episode-button',
    onClick: (ev) => {
      ev.stopPropagation();
      handleFormAndDialog().catch(openAlert);
    },
  });
};

export const attachAddEpisodeButton = () => {
  // for page bottom
  ScrapboxScriptApi.pageContainerElement.appendChild(createAddEpisodeButton());
};

export const main = () => {
  // no need to attach new button on page change.
  // scrapbox.io don't clear DOM of page container.
  attachAddEpisodeButton();
};
