export interface DebounceFn<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | void
}

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): DebounceFn<T> {
  let timer: number | undefined
  return (...args) => {
    if(timer !== undefined) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
      timer = undefined
    }, delay)
  }
}

export function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = debounce(() => {
    element.innerHTML = `count is ${counter++}`
  }, 300)
  element.addEventListener('click', () => setCounter())
  setCounter()
}
