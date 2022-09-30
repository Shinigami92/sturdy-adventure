export type KeybindType = 'keyboard';

export type KeybindState = 'pressed' | 'up' | 'down' | 'toggle';

export interface KeybindActionOptions {
  readonly action: string;
  readonly label: string;
  readonly type: KeybindType;
  readonly key: string;
  readonly state: KeybindState;
}

export class KeybindAction {
  public readonly action: string;
  public readonly label: string;
  public readonly type: KeybindType;
  public readonly key: string;
  public readonly state: KeybindState;

  public value = 0;

  public constructor({
    action,
    label,
    type,
    key,
    state,
  }: KeybindActionOptions) {
    this.action = action;
    this.label = label;
    this.type = type;
    this.key = key;
    this.state = state;
  }
}
