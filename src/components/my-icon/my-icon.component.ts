export type SupportedIcon = 'add' | 'apps' | 'clear' | 'view-modules' | 'widgets';

const iconSvg: Record<SupportedIcon, string> = {
  add: require('./svg/add.svg'),
  apps: require('./svg/apps.svg'),
  clear: require('./svg/clear.svg'),
  'view-modules': require('./svg/view_module.svg'),
  widgets: require('./svg/widgets.svg'),
} as const;
const initialHTML = iconSvg.apps;

export type SupportedPropertyName = 'type' | 'size';
const defaultSize = '24';

// TODO: should memoize
const registerSVG = (svg: string, parent: HTMLElement) => {
  const doc = new DOMParser().parseFromString(svg, 'application/xml');
  const elem = parent.ownerDocument!.importNode(doc.documentElement, true);
  parent.appendChild(elem);
};

export class MyIcon extends HTMLElement {
  static readonly elementName = 'my-icon';
  private svg: SVGElement | null = null;

  get size() {
    return this.getAttribute('size') as string;
  }

  set size(newValue: string) {
    this.setAttribute('size', newValue);
    this.applySize(newValue);
  }

  get type() {
    return (this.getAttribute('type') || '') as SupportedIcon;
  }

  set type(newValue: SupportedIcon) {
    this.setAttribute('type', newValue);
    this.render();
  }

  constructor(size?: string, type?: SupportedIcon) {
    super();
    // initial rendering to create svg child element
    this.render();

    this.size = size || this.size || defaultSize;
    this.type = type || this.type || '';
    // re-render after type updated
    this.render();
  }

  attributeChangedCallback(name: SupportedPropertyName, oldValue: string, newValue: string) {
    switch (name) {
      case 'type': {
        // TODO: validate value
        this.type = newValue as SupportedIcon;
        break;
      }
      case 'size': {
        this.size = newValue;
        break;
      }
    }

    this.render();
  }

  private render() {
    if (this.svg) {
      this.removeChild(this.svg);
    }

    const svgFragment = (iconSvg as any)[this.type] || initialHTML;
    registerSVG(svgFragment, this);
    this.svg = this.firstChild as SVGElement;
    this.applySize(this.size);
  }

  private applySize(val: string) {
    const px = `${val}px`;
    this.style.width = px;
    this.style.height = px;
    if (this.svg) {
      this.svg.setAttribute('width', px);
      this.svg.setAttribute('height', px);
    }
  }
}
