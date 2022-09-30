export class KeyboardInputManager {
  private readonly eventBindings: Array<
    [type: 'keydown' | 'keyup', listener: (event: KeyboardEvent) => void]
  > = [];

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

      window.addEventListener(type, listener, false);

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
