import { createElement } from '../../../libs/common/dom';
import { DomManipulator } from '../../../libs/scrapbox/dom/dom-manipulator';
import { Router } from '../../../libs/scrapbox/router';
import { openDialogAndWriteTags } from '../../tag-automation';

const createAddEpisodeButton = () => {
  return createElement({
    tag: 'button',
    contents: 'Add Episode',
    class: 'sx-add-episode-button',
    onClick: (ev) => {
      ev.stopPropagation();
      openDialogAndWriteTags();
    },
  });
};

export const attachAddEpisodeButton = () => {
  // for title right side
  DomManipulator.getTitleLine().appendChild(createAddEpisodeButton());

  // for page bottom
  DomManipulator.getPageContainer().appendChild(createAddEpisodeButton());
};

export const useAddEpisodeButton = () => {
  attachAddEpisodeButton(); // initial page
  Router.onPageChange(attachAddEpisodeButton);
};
