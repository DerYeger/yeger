/**
 * Debounce a callback with an optional delay.
 * @param cb - The callback that will be invoked.
 * @param delay - A delay after which the callback will be invoked.
 * @returns The debounced callback.
 */
export function debounce<Args extends any[]>(
  cb: (...args: Args) => void,
  delay?: number,
): (...args: Args) => void {
  let timeout: any
  return (...args: Args) => {
    if (timeout !== undefined) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => cb(...args), delay)
  }
}
