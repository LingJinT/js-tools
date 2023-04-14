export interface AnyFn {
  (...args: any): any
}

export interface DebounceFn<T extends AnyFn> {
  (this: any, ...args: Parameters<T>): ReturnType<T> | void
}

export interface ThrottleFn<T extends AnyFn> extends DebounceFn<T> {}

export interface ReduceCb<T, U> {
  (pre: U, cur: T, index: number, arr: Array<T>): U
}

export function debounce<T extends AnyFn>(fn: T, delay: number): DebounceFn<T> {
  let timer: number | undefined
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.call(this, ...args)
      timer = undefined
    }, delay)
  }
}

export function throttle<T extends AnyFn>(fn: T, delay: number): ThrottleFn<T> {
  let lastTime = 0
  return function (...args) {
    const curTime = Date.now()
    if(!lastTime || curTime - lastTime > delay) {
      fn.call(this, ...args)
      lastTime = Date.now()
    }
  }
}

export function reduceHack<T, U = T>(arr: Array<T>) {
  arr.constructor.prototype.reduce = (cb: ReduceCb<T, U>, initValue: U) => {
    for (let index = initValue !== undefined ? 0 : 1; index < arr.length; index++) {
      initValue = cb(initValue ?? (arr[0] as unknown as U), arr[index], index, arr)
    }
    return initValue
  }
}

export function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = throttle(() => {
    element.innerHTML = `count is ${counter++}`
  }, 300)
  element.addEventListener('click', () => setCounter())
  setCounter()
}
