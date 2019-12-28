import { defineCustomElements, MyConsoleButton, MyDebugBoard } from '../../components';

const manageTargetComponents = {
  [MyConsoleButton.elementName]: MyConsoleButton,
  [MyDebugBoard.elementName]: MyDebugBoard,
} as const;

type ManageTargetComponentsKeys = keyof typeof manageTargetComponents;
type ManageTargetComponents = MyConsoleButton | MyDebugBoard;

/**
 * Manage custom elements
 *
 * - register components to browser
 * - manage instance as singleton
 */
export class ComponentManager {
  private readonly components = new Map<ManageTargetComponentsKeys, ManageTargetComponents>();
  private setupCompleted = false;

  constructor() {
    // define and construct custom elements
    defineCustomElements();

    const debugBoard = new MyDebugBoard();
    const consoleButton = new MyConsoleButton();
    this.components.set(MyConsoleButton.elementName, consoleButton);
    this.components.set(MyDebugBoard.elementName, debugBoard);
  }

  /**
   * Call after document.ready
   */
  setupComponents() {
    if (this.setupCompleted) {
      return;
    }

    for (let c of this.components.values()) {
      document.body.appendChild(c);
    }

    this.setupCompleted = true;
  }
}

export const componentManager = new ComponentManager();
