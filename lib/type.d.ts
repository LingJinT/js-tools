export interface AnyFn {
  (...args: any): any;
}

export interface DebounceFn<T extends AnyFn> {
  (this: any, ...args: Parameters<T>): ReturnType<T> | void;
}

export interface ThrottleFn<T extends AnyFn> extends DebounceFn<T> {}