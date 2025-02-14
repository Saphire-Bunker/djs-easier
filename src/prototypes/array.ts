export class SArray<T> {
  [n: number]: T
  declare find: Array<T>["find"];
  declare findIndex: Array<T>["findIndex"];
  declare length: Array<T>["length"];
  declare map: Array<T>["map"];
  declare push: Array<T>["push"];
  declare sort: Array<T>["sort"];

  constructor() {
    Object.defineProperties(Array.prototype, {
      edit: { value: this.edit },
      random: { value: this.random },
      shuffle: { value: this.shuffle },
      toSet: { value: this.toSet },
    });
  }

  /** @DJSProtofy */
  edit(
    filter: (value: T, index: number, array: T[]) => boolean,
    edit: (value: T, index: number, array: T[]) => T,
    orPush?: () => T,
  ) {
    let push = true;

    for (let i = 0; i < this.length; i++) {
      if (filter(this[i], i, this as any)) {
        this[i] = edit(this[i], i, this as any);
        push = false;
        break;
      }
    }

    if (push && typeof orPush === "function") this.push(orPush());
  }

  /**
   * @DJSProtofy
   * 
   * @returns `undefined` when array is `empty` and amount is `undefined`
   * @returns `array` when amount is `number`
   */
  random(amount?: number, allowDuplicates?: boolean) {
    if (typeof amount === "number") {
      if (this.length === 0 || isNaN(amount) || amount < 1) return [];

      if (!allowDuplicates) amount = Math.min(amount, this.length);

      const result: T[] = [];
      let i = 0;

      if (allowDuplicates) {
        while (i < amount) result[i++] = this[Math.floor(Math.random() * this.length)];

        return result;
      }

      const clone = Array.from(this);

      while (i < amount) result[i++] = clone.splice(Math.floor(Math.random() * clone.length), 1)[0];

      return result;
    }

    if (this.length === 0) return;

    return this[Math.floor(Math.random() * this.length)];
  }

  /** @DJSProtofy */
  shuffle() {
    return this.sort(() => Math.random() - 0.5);
  }

  /** @DJSProtofy */
  toSet() {
    return new Set<T>(this);
  }

  *[Symbol.iterator](): ArrayIterator<T> { }
}
