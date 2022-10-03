import type { Disposable } from '@/utilities/disposable';

export type EventListenerElement =
  | Pick<
      HTMLElement,
      | 'addEventListener'
      | 'removeEventListener'
      | 'clientWidth'
      | 'clientHeight'
    >
  | Pick<
      typeof window,
      'addEventListener' | 'removeEventListener' | 'innerWidth' | 'innerHeight'
    >;

export interface MouseInputManagerOptions {
  /**
   * The element to listen to mouse events on.
   *
   * @default window
   */
  readonly domElement?: EventListenerElement;
}

/**
 * The mouse input manager.
 */
export class MouseInputManager implements Disposable {
  public readonly isDisposable = true;

  public markForDisposal = false;

  private readonly registrations: Array<{
    button: number;
    mousedown?: () => void;
    mouseup?: () => void;
    mousemove?: ({ x, y }: { x: number; y: number }) => void;
  }> = [];

  /**
   * The element to listen to mouse events on.
   */
  private readonly container: EventListenerElement;

  private readonly _mousedown = this.mousedown.bind(this);
  private readonly _mouseup = this.mouseup.bind(this);
  private readonly _mousemove = this.mousemove.bind(this);

  public constructor(
    options: MouseInputManagerOptions = { domElement: window },
  ) {
    this.container = options.domElement ?? window;

    this.container.addEventListener('mousedown', this._mousedown, false);
    this.container.addEventListener('mouseup', this._mouseup, false);
    this.container.addEventListener('mousemove', this._mousemove, false);
  }

  /**
   * Get the button number for the requested mouse key.
   *
   * @param key The `'left'` or `'right'` mouse button.
   * @returns The mouse button number.
   *
   * @throws {Error} If the requested key is not `'left'` or `'right'`.
   */
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

  private get innerWidth(): number {
    return 'innerWidth' in this.container
      ? this.container.innerWidth
      : this.container.clientWidth;
  }

  private get innerHeight(): number {
    return 'innerHeight' in this.container
      ? this.container.innerHeight
      : this.container.clientHeight;
  }

  private mousemove(event: MouseEvent | Event): void {
    const { clientX, clientY } = event as MouseEvent;
    const x = (clientX / this.innerWidth) * 2 - 1;
    const y = -(clientY / this.innerHeight) * 2 + 1;
    for (const { mousemove } of this.registrations) {
      if (mousemove) {
        mousemove({ x, y });
      }
    }
  }

  /**
   * Register a mouse button to listen to.
   *
   * @param options The options to register the mouse button with.
   */
  public register(options: {
    button: number;
    mousedown?: () => void;
    mouseup?: () => void;
    mousemove?: ({ x, y }: { x: number; y: number }) => void;
  }): void {
    const { button, mousedown, mouseup, mousemove } = options;
    this.registrations.push({ button, mousedown, mouseup, mousemove });
  }

  public dispose(): void {
    this.container.removeEventListener('mousedown', this._mousedown, false);
    this.container.removeEventListener('mouseup', this._mouseup, false);
    this.container.removeEventListener('mousemove', this._mousemove, false);
  }
}
