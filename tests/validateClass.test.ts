import { Validation, validate, validateAsync } from 'validar'
import { isValid, validateClass, validateClassAsync } from '../src/index'

jest.mock('validar')

const { validation } = jest.requireActual('validar')

let validationFail: Validation
let validationSuccess: Validation

let Person, Racer

beforeEach(() => {
  Person = class {
    name: string
    lastName: string
    static address: string
    static city: string
  }

  Racer = class extends Person {}

  validationFail = validation({
    test: () => true,
  })
  validationSuccess = validation({
    test: () => true,
  })
})
describe('Validate synchronously', () => {
  test('instance properties', () => {
    isValid(validationFail)(Person.prototype, 'name')
    isValid(validationSuccess)(Person.prototype, 'lastName')
    const person = new Person()
    const validators = {
      name: validationFail,
      lastName: validationSuccess,
    }

    validateClass(person)

    expect(validate).toBeCalledWith(validators, person)
  })

  test('static properties', () => {
    const validators = {
      address: validationFail,
      city: validationFail,
    }

    isValid(validationFail)(Person, 'address')
    isValid(validationFail)(Person, 'city')

    validateClass(Person)

    expect(validate).toBeCalledWith(validators, Person)
  })
})

describe('Validate asynchronously', () => {
  test('instance properties', async () => {
    const asyncTest = validation({
      test: () => {
        return Promise.resolve(true)
      },
    })
    const validators = {
      name: asyncTest,
      lastName: validationFail,
    }
    isValid(asyncTest)(Person.prototype, 'name')
    isValid(validationFail)(Person.prototype, 'lastName')
    const person = new Person()

    await validateClassAsync(person)

    expect(validateAsync).toBeCalledWith(validators, person)
  })

  test('static properties', async () => {
    const asyncTest = validation({
      test: () => {
        return Promise.resolve(true)
      },
    })
    const validators = {
      address: asyncTest,
      city: asyncTest,
    }
    isValid(asyncTest)(Person, 'address')
    isValid(asyncTest)(Person, 'city')

    await validateClassAsync(Person)

    expect(validateAsync).toBeCalledWith(validators, Person)
  })
})
