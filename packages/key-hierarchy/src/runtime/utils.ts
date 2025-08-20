export function deepFreeze(value: any): unknown {
  if (value === undefined || value === null) {
    return value
  }
  Object.freeze(value)
  Object.getOwnPropertyNames(value).forEach((prop) => {
    if (value[prop] !== null
      && (typeof value[prop] === 'object' || typeof value[prop] === 'function')
      && !Object.isFrozen(value[prop])) {
      deepFreeze(value[prop])
    }
  })
  return value
}

export function createClone<T>(value: T): T {
  if (typeof value === 'function' || typeof value === 'symbol') {
    return value
  }
  return structuredClone(value)
}
