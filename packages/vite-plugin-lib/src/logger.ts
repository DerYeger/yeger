import c from 'picocolors'

export function log(text: string): void {
  console.log(`${c.cyan('[vite:lib]')} ${text}`)
}

export function logWarn(text: string): void {
  console.warn(`${c.yellow('[vite:lib]')} ${text}`)
}

export function logError(text: string): void {
  console.error(`${c.red('[vite:lib]')} ${text}`)
}
