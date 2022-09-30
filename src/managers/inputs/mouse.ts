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

export class MouseInputManager {
  private readonly eventBindings: Array<
    [type: 'mousedown' | 'mouseup', listener: (event: MouseEvent) => void]
  > = [];

  private readonly container: EventListenerElement;

  public constructor(
    options: MouseInputManagerOptions = { domElement: window },
  ) {
    this.container = options.domElement ?? window;
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

  public register(options: {
    button: number;
    mousedown?: () => void;
    mouseup?: () => void;
  }): void {
    const { button, mousedown, mouseup } = options;

    if (mousedown) {
      const [type, listener]: ['mousedown', (event: MouseEvent) => void] = [
        'mousedown',
        (event) => {
          if (event.button === button) {
            mousedown();
          }
        },
      ];

      this.container.addEventListener(type, listener as any, false);

      this.eventBindings.push([type, listener]);
    }

    if (mouseup) {
      const [type, listener]: ['mouseup', (event: MouseEvent) => void] = [
        'mouseup',
        (event) => {
          if (event.button === button) {
            mouseup();
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
