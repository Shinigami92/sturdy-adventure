/**
 * Should be implemented by classes that need to be reset to their initial state, if requested.
 */
export interface Resettable {
  /**
   * Always `true`.
   *
   * This is used to check if an object implements {@link Resettable}.
   *
   * @see {@link isResettable}
   */
  readonly isResettable: true;

  /**
   * Resets the object to its initial state.
   */
  reset(): void;
}

/**
 * Check if an object implements {@link Resettable}.
 *
 * @param value The value to check.
 * @returns `true` if the value implements {@link Resettable}, `false` otherwise.
 */
export function isResettable(value: any): value is Resettable {
  return value?.isResettable === true;
}
