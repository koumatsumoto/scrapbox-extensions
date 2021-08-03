import './loading-indicator.scss';

// @see https://fonts.google.com/icons?selected=Material%20Icons%20Outlined%3Async
const svg = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M.01 0h24v24h-24V0z" fill="none"/><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>`;

export class SxLoadingIndicator extends HTMLElement {
  static readonly elementName = 'sx-loading-indicator';

  constructor() {
    super();

    this.innerHTML = `${svg}`;
  }
}

// register customElement once
// @see https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define
try {
  customElements.define(SxLoadingIndicator.elementName, SxLoadingIndicator);
} catch {
  // ignore for storybook reloading
}
