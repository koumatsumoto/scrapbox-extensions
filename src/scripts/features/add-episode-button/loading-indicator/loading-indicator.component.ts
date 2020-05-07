const html = require('./loading-indicator.component.html');

export class SxLoadingIndicatorComponent extends HTMLElement {
  static readonly elementName = 'sx-loading-indicator';
  private container: HTMLDivElement;

  constructor() {
    super();

    this.innerHTML = `${html}`;
    this.container = this.querySelector<HTMLDivElement>('.loading-indicator-container')!;
  }
}
