export interface Disposable {
  isDisposable: true;

  markForDisposal: boolean;

  dispose(): void;
}

export function isDisposable(value: any): value is Disposable {
  return value?.isDisposable === true;
}
