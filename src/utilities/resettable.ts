export interface Resettable {
  readonly isResettable: true;

  reset(): void;
}

export function isResettable(value: any): value is Resettable {
  return value?.isResettable === true;
}
