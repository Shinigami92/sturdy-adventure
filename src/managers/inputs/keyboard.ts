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

export class KeyboardInputManager {
  private readonly eventBindings: Array<
    [type: 'keydown' | 'keyup', listener: (event: KeyboardEvent) => void]
  > = [];

  private readonly container: EventListenerElement;

  public constructor(
    options: KeyboardInputManagerOptions = { domElement: window },
  ) {
    this.container = options.domElement ?? window;
  }

  public register(options: {
    key: string;
    keydown?: () => void;
    keyup?: () => void;
  }): void {
    const { key, keydown, keyup } = options;

    if (keydown) {
      const [type, listener]: ['keydown', (event: KeyboardEvent) => void] = [
        'keydown',
        (event) => {
          if (event.key === key) {
            keydown();
          }
        },
      ];

      this.container.addEventListener(type, listener as any, false);

      this.eventBindings.push([type, listener]);
    }

    if (keyup) {
      const [type, listener]: ['keyup', (event: KeyboardEvent) => void] = [
        'keyup',
        (event) => {
          if (event.key === key) {
            keyup();
          }
        },
      ];

      this.container.addEventListener(type, listener as any, false);

      this.eventBindings.push([type, listener]);
    }
  }

  public dispose(): void {
    for (const [type, listener] of this.eventBindings) {
      this.container.removeEventListener(type, listener as any, false);
    }
  }
}
