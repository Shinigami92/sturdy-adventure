import type { Disposable } from '@/utilities/disposable';

export type EventListenerElement = {
  addEventListener:
    | HTMLElement['addEventListener']
    | typeof window['addEventListener'];
  removeEventListener:
    | HTMLElement['removeEventListener']
    | typeof window['removeEventListener'];
};

export interface MouseInputManagerOptions {
  readonly domElement?: EventListenerElement;
}

export class MouseInputManager implements Disposable {
  public readonly isDisposable = true;

  public markForDisposal = false;

  private readonly registrations: Array<{
    button: number;
    mousedown?: () => void;
    mouseup?: () => void;
  }> = [];

  private readonly container: EventListenerElement;

  private readonly _mousedown = this.mousedown.bind(this);
  private readonly _mouseup = this.mouseup.bind(this);

  public constructor(
    options: MouseInputManagerOptions = { domElement: window },
  ) {
    this.container = options.domElement ?? window;

    this.container.addEventListener('mousedown', this._mousedown, false);
    this.container.addEventListener('mouseup', this._mouseup, false);
  }

  public getButton(key: string): number {
    switch (key) {
      case 'left':
        return 0;

      case 'right':
        return 2;
    }

    throw new Error(`Unknown mouse button: ${key}`);
  }

  private mousedown(event: MouseEvent | Event): void {
    const { button: eventButton } = event as MouseEvent;
    for (const { button, mousedown } of this.registrations) {
      if (mousedown && eventButton === button) {
        mousedown();
      }
    }
  }

  private mouseup(event: MouseEvent | Event): void {
    const { button: eventButton } = event as MouseEvent;
    for (const { button, mouseup } of this.registrations) {
      if (mouseup && eventButton === button) {
        mouseup();
      }
    }
  }

  public register(options: {
    button: number;
    mousedown?: () => void;
    mouseup?: () => void;
  }): void {
    const { button, mousedown, mouseup } = options;
    this.registrations.push({ button, mousedown, mouseup });
  }

  public dispose(): void {
    this.container.removeEventListener('mousedown', this._mousedown, false);
    this.container.removeEventListener('mouseup', this._mouseup, false);
  }
}
