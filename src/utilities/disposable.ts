/**
 * Should be implemented by classes that need to be disposed, if requested or marked for dispose.
 */
export interface Disposable {
  /**
   * Always `true`.
   *
   * This is used to check if an object implements {@link Disposable}.
   *
   * @see {@link isDisposable}
   */
  readonly isDisposable: true;

  /**
   * Marks the object for dispose.
   *
   * Set this to true to mark the object for dispose, if you want to dispose it later e.g. outside a loop or `scene.traversal`.
   */
  markForDisposal: boolean;

  /**
   * Disposes the object.
   */
  dispose(): void;
}

/**
 * Check if an object implements {@link Disposable}.
 *
 * @param value The value to check.
 * @returns `true` if the value implements {@link Disposable}, `false` otherwise.
 */
export function isDisposable(value: any): value is Disposable {
  return value?.isDisposable === true;
}
