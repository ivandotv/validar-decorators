import { Validation, ValidationResult, validate, validateAsync } from 'validar'

const metaKey = '__validar_metadata__'

export function isValid(validation: Validation | Validation[] | any): Function {
  return function(target: any, key: string) {
    const metaData = initMetadata(target, metaKey)

    if (typeof metaData[key] !== 'undefined') {
      throw new Error(`Only one @isValid decorator per field is allowed`)
    }

    metaData[key] = validation
  }
}

function initMetadata(target: any, metaKey: string): any {
  // if (!(metaKey in target)) {
  // eslint-disable-next-line
  if (!target.hasOwnProperty(metaKey)) {
    Object.defineProperty(target, metaKey, {
      value: {},
      writable: true,
    })
  }

  return target[metaKey]
}

export function validateClass(target): ValidationResult {
  const validators = getValidators(target, metaKey)
  return validate(validators, target)
}

export function validateClassAsync(target): Promise<ValidationResult> {
  const validators = getValidators(target, metaKey)
  return validateAsync(validators, target)
}

function getValidators(target: any, metaKey: string): any {
  return target[metaKey]
}
