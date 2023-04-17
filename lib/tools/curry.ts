export default function curry(fn: Function) {
  return function curried(this: unknown, ...args: any[]): any {
    return fn.length <= args.length ? fn.apply(this, args) : curried.bind(this, ...args)
  }
}