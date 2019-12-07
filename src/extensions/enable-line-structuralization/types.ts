// manipulatable object over Element
export interface ManipulatableElement extends Element {}

export class Tag {
  // '#tag-name'
  readonly raw: string;
  // 'tag-name'
  readonly name: string;

  constructor(raw: string, name: string) {
    this.raw = raw;
    this.name = name;
  }
}

export class Meta {
  readonly raw: ManipulatableElement;

  constructor(raw: ManipulatableElement) {
    this.raw = raw;
  }
}

export class ValidBlock {
  readonly meta: Meta;
  readonly symbol: ManipulatableElement;
  readonly text: ManipulatableElement[] = [];

  constructor(meta: Meta, symbol: ManipulatableElement, text: ManipulatableElement[]) {
    this.meta = meta;
    this.symbol = symbol;
    this.text = text;
  }
}

export class InvalidBlock {
  readonly meta?: Meta;
  readonly symbol?: ManipulatableElement;
  readonly text?: ManipulatableElement[] = [];

  constructor(meta?: Meta, symbol?: ManipulatableElement, text?: ManipulatableElement[]) {
    if (meta) {
      this.meta = meta;
    }
    if (symbol) {
      this.symbol = symbol;
    }
    if (text) {
      this.text = text;
    }
  }
}

export type Block = ValidBlock | InvalidBlock;

export class Container {
  readonly blocks: Block[];

  constructor(blocks: Block[]) {
    this.blocks = blocks;
  }
}

export class Page {
  readonly title: ManipulatableElement;
  readonly container: Container;

  constructor(title: ManipulatableElement, container: Container) {
    this.title = title;
    this.container = container;
  }
}
