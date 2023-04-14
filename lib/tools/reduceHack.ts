interface ReduceCb<T, U> {
  (pre: U, cur: T, index: number, arr: Array<T>): U;
}

export default function reduceHack<T, U = T>(arr: Array<T>) {
  arr.constructor.prototype.reduce = (cb: ReduceCb<T, U>, initValue: U) => {
    for (
      let index = initValue !== undefined ? 0 : 1;
      index < arr.length;
      index++
    ) {
      initValue = cb(
        initValue ?? (arr[0] as unknown as U),
        arr[index],
        index,
        arr
      );
    }
    return initValue;
  };
}