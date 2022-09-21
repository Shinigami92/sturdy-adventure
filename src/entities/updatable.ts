export interface Updatable {
  readonly isUpdatable: true;

  update(delta: number): void;
}

export function isUpdatable(value: any): value is Updatable {
  return value?.isUpdatable === true;
}
