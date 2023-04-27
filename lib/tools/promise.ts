export interface Thenable<T> {
  then<R1 = T, R2 = never>(
    this: Thenable<T>,
    onFulfilled: OnFulfilled<T, R1>,
    onRejected: OnRejected<R2>
  ): Thenable<R1 | R2>;
}

export type OnFulfilled<T, R> =
  | ((value: T) => R | Thenable<R>)
  | undefined
  | null;

export type OnRejected<R> =
  | ((reason: any) => R | Thenable<R>)
  | undefined
  | null;

type Status = "pending" | "fulfilled" | "rejected";
type OnFulfilledQueue<T> = OnFulfilled<T, any>[];
type onRejectedQueue<T> = OnRejected<T>[];

type ResolveFn<T> = (data: T | Thenable<T>) => void;
type RejectFn = (reason: Error | string) => void;
type Exec<T> = (resolve: ResolveFn<T>, reject: RejectFn) => void;

function nextPromise<T extends Function>(
  promise: Thenable<T>,
  x: Thenable<T> | T,
  resolve: ResolveFn<T>,
  reject: RejectFn
) {
  if (promise === x) {
    return reject(new Error("same promise"));
  }
  if (typeof (x as Thenable<T>).then === 'function') {
    let called = false;
    try {
      (x as Thenable<T>).then.call(
        x as Thenable<T>,
        function (data) {
          if (called) return;
          called = true;
          nextPromise(promise, data, resolve, reject);
        },
        function (err) {
          if (called) return;
          called = true;
          reject(err);
        }
      );
    } catch (error: any) {
      if (called) return;
      reject(error);
    }
    return;
  }
  resolve(x);
}

export default class Promise<T> implements Thenable<T> {
  status: Status = "pending";
  result: any = undefined;
  onFulfilledQueue: OnFulfilledQueue<T> = [];
  onRejectedQueue: onRejectedQueue<any> = [];
  constructor(exec: Exec<T>) {
    const resolve: ResolveFn<T> = (data) => {
      if (this.status === "pending") {
        this.status = "fulfilled";
        this.result = data;
        this.onFulfilledQueue.forEach((onFulfilled) => {
          onFulfilled?.(data as T);
        });
      }
    };

    const reject: RejectFn = (err) => {
      if (this.status === "pending") {
        this.status = "rejected";
        this.result = err;
        this.onRejectedQueue.forEach((onRejected) => {
          onRejected?.(err);
        });
      }
    };
    try {
      exec(resolve, reject);
    } catch (error: any) {
      reject(error);
    }
  }

  then<R1 = T, R2 = never>(onFulfilled: OnFulfilled<T, any>, onRejected: OnRejected<any>) {
    const promise2: Thenable<R1 | R2> = new Promise<R1 | R2>((resolve, reject) => {
      const _onFulfilled: typeof onFulfilled = (...args) => {
        try {
          const data = onFulfilled?.apply(this, args);
          if (typeof data.then !== "function") {
            resolve(data);
          } else {
            setTimeout(() => {
              nextPromise(promise2 as Thenable<Function>, data, resolve as ResolveFn<Function>, reject);
            })
          }
        } catch (error: any) {
          reject(error);
        }
      }
      const _onRejected: typeof onRejected = (...args) => {
        try {
          const err = onRejected?.apply(this, args);
          if (typeof err.then !== "function") {
            reject(err);
          } else {
            setTimeout(() => {
              nextPromise(promise2 as Thenable<Function>, err, resolve as ResolveFn<Function>, reject);
            })
          }
        } catch (error: any) {
          reject(error);
        }
      }
      this.onFulfilledQueue.push(_onFulfilled);
      this.onRejectedQueue.push(_onRejected);
    });
    return promise2
  }
}

Promise.deferred = function() {
  var result = {};
  result.promise = new MyPromise(function(resolve, reject){
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
}
