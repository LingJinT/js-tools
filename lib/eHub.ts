function eHub<E>(all?: Map<keyof E, E[keyof E]>) {
  all = all || new Map()
  return {
    all,
    on(key, callback) {
      all!.set(key, callback)
    },
    off(key) {

    },
    emit(key, value) {

    }
  }
}

export default eHub