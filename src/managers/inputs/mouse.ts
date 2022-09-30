export class MouseInputManager {
  private readonly eventBindings: Array<
    [type: 'mousedown' | 'mouseup', listener: (event: MouseEvent) => void]
  > = [];

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

      window.addEventListener(type, listener, false);

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

      window.addEventListener(type, listener, false);

      this.eventBindings.push([type, listener]);
    }
  }

  public dispose(): void {
    for (const [type, listener] of this.eventBindings) {
      window.removeEventListener(type, listener, false);
    }
  }
}
