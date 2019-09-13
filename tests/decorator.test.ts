import { isValid, validateClass, validateClassAsync } from '../src/index'
import { validation, Validation } from 'validar'

//todo test class inheritance static i sve ostalo

let validationFail: Validation
let validationSuccess: Validation
const metaKey: string = '__validar_metadata__'

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
describe('isValid decorator', () => {
  test('throw if multiple decorators on the same field', () => {
    expect(() => {
      // eslint-disable-next-line
      class Person {
        @isValid(validationFail)
        @isValid(validationSuccess)
        name: string
      }
    }).toThrow('one @isValid')
  })
  describe('Create metadata', () => {
    test('instance properties', () => {
      const validators = {
        name: validationFail,
        lastName: validationFail,
      }

      class Person {
        @isValid(validationFail)
        name: string

        @isValid(validationFail)
        lastName: string
      }

      expect(Person.prototype[metaKey]).toEqual(validators)
    })

    test('class static properties', () => {
      const staticValidators = {
        firstName: validationFail,
        lastName: [validationFail, validationSuccess],
      }
      const protoValidators = {
        lastName: validationFail,
      }

      class Person {
        @isValid(validationFail)
        static firstName: string

        @isValid([validationFail, validationSuccess])
        static lastName: string

        @isValid(validationFail)
        lastName: string
      }

      expect(Person[metaKey]).toEqual(staticValidators)
      expect(Person.prototype[metaKey]).toEqual(protoValidators)
    })
    test('instance properties - deeply nested', () => {
      const validators = {
        data: {
          location: {
            city: [validationSuccess, validationFail],
            address: {
              street: [validationSuccess, validationSuccess],
            },
          },
        },
        name: validationFail,
      }

      class Person {
        @isValid({
          location: {
            city: [validationSuccess, validationFail],
            address: {
              street: [validationSuccess, validationSuccess],
            },
          },
        })
        data: any

        @isValid(validationFail)
        name: string
      }

      expect(Person.prototype[metaKey]).toEqual(validators)
    })
    test('static properties - deeply nested', () => {
      const validators = {
        data: {
          location: {
            city: [validationSuccess, validationFail],
            address: {
              street: [validationSuccess, validationSuccess],
            },
          },
        },
        firstName: validationFail,
      }

      class Person {
        @isValid({
          location: {
            city: [validationSuccess, validationFail],
            address: {
              street: [validationSuccess, validationSuccess],
            },
          },
        })
        static data: any

        @isValid(validationFail)
        static firstName: string
      }

      expect(Person[metaKey]).toEqual(validators)
    })
  })
})
