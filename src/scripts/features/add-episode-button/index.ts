import { createElement } from '../../../libs/common/dom';
import { DomManipulator } from '../../../libs/scrapbox/dom/dom-manipulator';
import { Router } from '../../../libs/scrapbox/router';
import { openDialogAndWriteTags } from '../../tag-automation';

const createAddEpisodeButton = () => {
  return createElement({
    tag: 'div',
    contents: 'Add Episode',
    class: 'sx-add-episode-button',
    onClick: () => openDialogAndWriteTags(),
  });
};

export const attachAddEpisodeButton = () => {
  // for title right side
  const title = DomManipulator.getTitleLine();
  if (title) {
    title.appendChild(createAddEpisodeButton());
  }
};

export const useAddEpisodeButton = () => {
  Router.onPageChange(attachAddEpisodeButton);
};
