import c from 'picocolors'

export function log(text: string): void {
  // eslint-disable-next-line no-console
  console.log(`${c.cyan('[vite:lib]')} ${text}`)
}

export function logWarn(text: string): void {
  console.warn(`${c.yellow('[vite:lib]')} ${text}`)
}

export function logError(text: string): void {
  console.error(`${c.red('[vite:lib]')} ${text}`)
}
