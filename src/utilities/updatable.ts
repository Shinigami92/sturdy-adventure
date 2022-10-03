/**
 * Should be implemented by classes that need to be updated, if requested.
 */
export interface Updatable {
  /**
   * Always `true`.
   *
   * This is used to check if an object implements {@link Updatable}.
   *
   * @see {@link isUpdatable}
   */
  readonly isUpdatable: true;

  /**
   * Updates the object.
   *
   * @param delta The time elapsed since the last update, in milliseconds.
   */
  update(delta: number): void;
}

/**
 * Check if an object implements {@link Updatable}.
 *
 * @param value The value to check.
 * @returns `true` if the value implements {@link Updatable}, `false` otherwise.
 */
export function isUpdatable(value: any): value is Updatable {
  return value?.isUpdatable === true;
}
