/**
 * Debounce a callback with an optional delay.
 * @param cb - The callback that will be invoked.
 * @param delay - A delay after which the callback will be invoked.
 * @returns The debounced callback.
 */
export function debounce(cb: () => void, delay?: number) {
  let timeout: any
  return () => {
    if (timeout !== undefined) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => cb(), delay)
  }
}
