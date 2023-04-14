import { AnyFn, DebounceFn } from "../type";

export default function debounce<T extends AnyFn>(fn: T, delay: number): DebounceFn<T> {
  let timer: number | undefined;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.call(this, ...args);
      timer = undefined;
    }, delay);
  };
}