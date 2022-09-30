import type { Disposable } from '@/utilities/disposable';

export type EventListenerElement = {
  addEventListener:
    | HTMLElement['addEventListener']
    | typeof window['addEventListener'];
  removeEventListener:
    | HTMLElement['removeEventListener']
    | typeof window['removeEventListener'];
};

export interface KeyboardInputManagerOptions {
  readonly domElement?: EventListenerElement;
}

export class KeyboardInputManager implements Disposable {
  public readonly isDisposable = true;

  public markForDisposal = false;

  private readonly registrations: Array<{
    key: string;
    keydown?: () => void;
    keyup?: () => void;
  }> = [];

  private readonly container: EventListenerElement;

  private readonly _keydown = this.keydown.bind(this);
  private readonly _keyup = this.keyup.bind(this);

  public constructor(
    options: KeyboardInputManagerOptions = { domElement: window },
  ) {
    this.container = options.domElement ?? window;

    this.container.addEventListener('keydown', this._keydown, false);
    this.container.addEventListener('keyup', this._keyup, false);
  }

  private keydown(event: KeyboardEvent | Event): void {
    const { key: eventKey } = event as KeyboardEvent;
    for (const { key, keydown } of this.registrations) {
      if (keydown && eventKey === key) {
        keydown();
      }
    }
  }

  private keyup(event: KeyboardEvent | Event): void {
    const { key: eventKey } = event as KeyboardEvent;
    for (const { key, keyup } of this.registrations) {
      if (keyup && eventKey === key) {
        keyup();
      }
    }
  }

  public register(options: {
    key: string;
    keydown?: () => void;
    keyup?: () => void;
  }): void {
    const { key, keydown, keyup } = options;
    this.registrations.push({ key, keydown, keyup });
  }

  public dispose(): void {
    this.container.removeEventListener('keydown', this._keydown, false);
    this.container.removeEventListener('keyup', this._keyup, false);
  }
}
