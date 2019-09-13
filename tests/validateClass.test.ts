jest.mock('validar')
import { isValid, validateClass, validateClassAsync } from '../src/index'
import { Validation, validate, validateAsync } from 'validar'

const { validation } = jest.requireActual('validar')

let validationFail: Validation
let validationSuccess: Validation

beforeEach(() => {
  validationFail = validation({
    test: () => {
      return {
        valid: false,
      }
    },
  })
  validationSuccess = validation({
    test: () => {
      return {
        valid: true,
      }
    },
  })
})

describe('Validate synchronously', () => {
  test('instance properties', () => {
    class Person {
      @isValid(validationFail)
      name: string

      @isValid(validationFail)
      lastName: string
    }

    const person = new Person()

    const validators = {
      name: validationFail,
      lastName: validationFail,
    }
    validateClass(person)

    expect(validate).toBeCalledWith(validators, person)
  })
  test('static properties', () => {
    class Person {
      @isValid(validationFail)
      static firstName: string = 'Sam'

      @isValid(validationFail)
      static lastName: string = 'Fisher'
    }
    const validators = {
      firstName: validationFail,
      lastName: validationFail,
    }

    const result = validateClass(Person)

    expect(validate).toBeCalledWith(validators, Person)
  })
})
describe('Validate asynchronously', () => {
  test('instance properties', () => {
    const asyncTest = validation({
      test: () => {
        return Promise.resolve(true)
      },
    })
    class Person {
      @isValid(asyncTest)
      name: string

      @isValid(validationFail)
      lastName: string
    }
    const person = new Person()
    const validators = {
      name: asyncTest,
      lastName: validationFail,
    }

    validateClassAsync(person)

    expect(validateAsync).toBeCalledWith(validators, person)
  })
  test('static properties', () => {
    const asyncTest = validation({
      test: () => {
        return Promise.resolve(true)
      },
    })
    class Person {
      @isValid(asyncTest)
      static firstName: string = 'Sam'

      @isValid(asyncTest)
      static lastName: string = 'Fisher'
    }
    const validators = {
      firstName: asyncTest,
      lastName: asyncTest,
    }

    const result = validateClassAsync(Person)

    expect(validateAsync).toBeCalledWith(validators, Person)
  })
})
