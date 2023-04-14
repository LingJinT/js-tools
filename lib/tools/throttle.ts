import { AnyFn, ThrottleFn } from "../type";

export default function throttle<T extends AnyFn>(fn: T, delay: number): ThrottleFn<T> {
  let lastTime = 0;
  return function (...args) {
    const curTime = Date.now();
    if (!lastTime || curTime - lastTime > delay) {
      fn.call(this, ...args);
      lastTime = Date.now();
    }
  };
}