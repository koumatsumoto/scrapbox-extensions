import { none, Option, some } from 'fp-ts/es6/Option';
import { removeElement } from '../../common/dom';

// used in css also
export const name = 'sx-dialog';

export class SxDialog<V> extends HTMLElement {
  // whether form submitted or canceled
  private readonly result: Promise<Option<V>>;
  private readonly dialog: HTMLDialogElement;
  private resolve!: (v: Option<V>) => void;

  constructor() {
    super();

    this.innerHTML = '<dialog></dialog>';
    this.dialog = this.querySelector<HTMLDialogElement>('dialog')!;
    this.result = new Promise<Option<V>>((resolve) => (this.resolve = resolve));
  }

  open() {
    this.dialog.showModal();

    return this.result;
  }

  ok(value: V) {
    this.resolve(some(value));
  }

  cancel() {
    this.resolve(none);
    this.close();
  }

  attach(element: HTMLElement) {
    this.dialog.innerHTML = ''; // reset
    this.dialog.appendChild(element);
  }

  private close() {
    this.dialog.close();
    removeElement(this);
  }
}
