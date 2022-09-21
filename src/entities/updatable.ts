export interface Updatable {
  update(delta: number): void;
}

export function isUpdatable(value: any): value is Updatable {
  return typeof value?.update === 'function';
}
