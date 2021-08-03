import { SxAddEpisodeFormComponent } from './form.component';

// TODO: use decorator to management customElements.define
const getDefineElementsFn = () => {
  let formDefined = false;

  return () => {
    if (!formDefined) {
      customElements.define(SxAddEpisodeFormComponent.elementName, SxAddEpisodeFormComponent);
      formDefined = true;
    }
  };
};

export const defineElementsIfNeeded = getDefineElementsFn();
