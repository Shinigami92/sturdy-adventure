// TODO @Shinigami92 2022-09-27: Temporary class which will be replaced by another Score system

import type { Resettable } from '@/utilities/resettable';

/** @deprecated */
export class Score implements Resettable {
  readonly isResettable = true;

  #score = 0;

  #highScore = 0;

  public get score(): number {
    return this.#score;
  }

  public set score(value: number) {
    this.#score = value;

    if (this.#score > this.#highScore) {
      this.#highScore = this.#score;
    }
  }

  public get highScore(): number {
    return this.#highScore;
  }

  public reset(): void {
    this.#score = 0;
  }
}
