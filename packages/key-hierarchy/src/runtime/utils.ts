export function deepFreeze(value: any): unknown {
  Object.freeze(value)
  if (value === undefined) {
    return value
  }

  Object.getOwnPropertyNames(value).forEach((prop) => {
    if (value[prop] !== null
      && (typeof value[prop] === 'object' || typeof value[prop] === 'function')
      && !Object.isFrozen(value[prop])) {
      deepFreeze(value[prop])
    }
  })
  return value
}
