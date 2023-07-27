import c from 'picocolors'

export function log(text: string) {
  // eslint-disable-next-line no-console
  console.log(`${c.cyan('[vite:lib]')} ${text}`)
}

export function logWarn(text: string) {
  console.warn(`${c.yellow('[vite:lib]')} ${text}`)
}

export function logError(text: string) {
  console.error(`${c.red('[vite:lib]')} ${text}`)
}
