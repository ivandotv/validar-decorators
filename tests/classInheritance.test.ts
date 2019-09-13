import { isValid, validateClass, validateClassAsync } from '../src/index'
import { validation, Validation } from 'validar'

//todo test class inheritance static i sve ostalo

let validationFail: Validation
let validationSuccess: Validation

const message = (value, key, path): string => {
  return `${value}|${key}|${path}`
}
const metaKey: string = '__validar_metadata__'

beforeEach(() => {
  validationFail = validation({
    test: () => {
      return {
        valid: false,
      }
    },
    message: message,
  })
  validationSuccess = validation({
    test: () => {
      return {
        valid: true,
      }
    },
    message: message,
  })
})
describe('Class inheritance', () => {
  test('validate subclass', () => {
    const validators = {
      name: validationFail,
      lastName: validationFail,
    }

    const nameValue = 'Sam'
    const lastNameValue = 'Fisher'
    class Person {
      @isValid(validationFail)
      name: string

      @isValid(validationFail)
      lastName: string
    }

    class Racer extends Person {
      //   @isValid(validationFail)
      name: string

      //   @isValid(validationFail)
      lastName: string
    }

    const racer = new Racer()
    racer.name = nameValue
    racer.lastName = lastNameValue

    const nameError = {
      error: true,
      missing: false,
      value: nameValue,
      field: 'name',
      path: 'name',
      message: message(nameValue, 'name', 'name'),
    }
    const lastNameError = {
      error: true,
      missing: false,
      value: lastNameValue,
      field: 'lastName',
      path: 'lastName',
      message: message(lastNameValue, 'lastName', 'lastName'),
    }

    const expectedResult = {
      valid: false,
      errors: [nameError, lastNameError],
      missing: [],
      struct: {
        name: nameError,
        lastName: lastNameError,
      },
    }

    const result = validateClass(racer)

    expect(result).toEqual(expect.objectContaining(expectedResult))
  })

  test('override in subclass', () => {
    const validators = {
      name: validationSuccess,
      lastName: validationSuccess,
    }

    const nameValue = 'Sam'
    const lastNameValue = 'Fisher'
    class Person {
      @isValid(validationFail)
      name: string

      @isValid(validationFail)
      lastName: string
    }

    class Racer extends Person {
      @isValid(validationSuccess)
      name: string

      @isValid(validationSuccess)
      lastName: string
    }

    const racer = new Racer()
    racer.name = nameValue
    racer.lastName = lastNameValue

    const nameError = {
      error: false,
      missing: false,
      value: nameValue,
      field: 'name',
      path: 'name',
      message: '',
    }
    const lastNameError = {
      error: false,
      missing: false,
      value: lastNameValue,
      field: 'lastName',
      path: 'lastName',
      message: '',
    }
    const expectedResult = {
      valid: true,
      errors: [],
      missing: [],
      struct: {
        name: nameError,
        lastName: lastNameError,
      },
    }

    const result = validateClass(racer)

    expect(result).toEqual(expect.objectContaining(expectedResult))
  })
})
