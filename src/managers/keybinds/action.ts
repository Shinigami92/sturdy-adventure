export type KeybindState = 'up' | 'down' | 'pressed' | 'toggle';

export interface KeybindActionOptions {
  readonly action: string;
  readonly label: string;
  readonly type: string;
  readonly key: string;
  readonly state: KeybindState;
}

export class KeybindAction {
  public readonly action: string;
  public readonly label: string;
  public readonly type: string;
  public readonly key: string;
  public readonly state: KeybindState;

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
