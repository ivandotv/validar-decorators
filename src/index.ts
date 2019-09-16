import { Validation, ValidationResult, validate, validateAsync } from 'validar'

/** string to be used for storing metadata */
const metaKey = '__validar_metadata__'

/**
 * Function for setting up decorator for validating class properties.
 * @param validation validation to be used for validating class property
 * @returns actual decorator
 */
export function isValid(validation: Validation | Validation[] | any): Function {
  return function(target: any, key: string) {
    const metaData = initMetadata(target, metaKey)

    if (typeof metaData[key] !== 'undefined') {
      throw new Error(`Only one @isValid decorator per field is allowed`)
    }

    metaData[key] = validation
  }
}

/**
 * Pass class instance or class itself to the {@link https://ivandotv.github.io/validar/validate| validar package `validate` function}
 * to be validated.
 * @param target  class or instance of a class
 * @returns - {@link https://ivandotv.github.io/validar/validate/validation-result.html | validation result}
 */
export function validateClass(target): ValidationResult {
  const validators = getValidators(target, metaKey)
  return validate(validators, target)
}

/**
 * Pass class instance or class itself to the {@link  https://ivandotv.github.io/validar/validate/validate-async.html| validar package `validateAsync` function}
 * to be validated asynchronously.
 * @param target  class or instance of a class
 * @returns - {@link https://ivandotv.github.io/validar/validate/validation-result.html | validation result}
 */
export function validateClassAsync(target): Promise<ValidationResult> {
  const validators = getValidators(target, metaKey)
  return validateAsync(validators, target)
}

function getValidators(target: any, metaKey: string): any {
  return target[metaKey]
}

function initMetadata(target: any, metaKey: string): any {
  // eslint-disable-next-line
  if (!target.hasOwnProperty(metaKey)) {
    Object.defineProperty(target, metaKey, {
      value: {},
      writable: true,
    })
  }

  return target[metaKey]
}
