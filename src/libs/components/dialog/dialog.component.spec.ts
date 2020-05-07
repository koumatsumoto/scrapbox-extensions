/**
 * @jest-environment jest-environment-happy-dom
 */

import { SxDialog } from './dialog.component';

describe('DialogComponent', () => {
  let elem: SxDialog;

  beforeEach(() => {
    elem = new SxDialog();
  });

  test('can set content element', () => {
    const div = document.createElement('div');
    elem.setContent(div);

    const found = elem.querySelector('div');
    expect(found).toBe(div);
  });
});
