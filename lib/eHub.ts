export type Callback<T> = (e: T) => void

function eHub<E extends Record<string | symbol, unknown>>(all?: Map<keyof E, Array<Callback<E[keyof E]>>>) {
  all = all || new Map()
  return {
    all,
    on<K extends keyof E>(key: K, callback: Callback<E[keyof E]>) {
      let callbacks = all!.get(key)
      if(callbacks) {
        callbacks.push(callback)
      }
      callbacks = [callback]
      all!.set(key, callbacks)
    },
    off<K extends keyof E>(key: K, callback: Callback<E[keyof E]>) {
      const callbacks = all!.get(key)
      if(callbacks && callback) {
        callbacks.splice(callbacks.indexOf(callback), 1)
      } else {
        all!.set(key, [])
      }
    },
    emit<K extends keyof E>(key: K, value?: E[K]) {
      const callbacks = (all!.get(key) || []).concat(all!.get('*') || [])
      callbacks?.forEach(fn => {
        fn(value!)
      })

    }
  }
}

export default eHub