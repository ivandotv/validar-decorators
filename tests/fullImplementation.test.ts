import { Validation, validation } from 'validar'
import { isValid as check, validateClass } from '../src/index'

//TODO - ovaj fajl mozda izbaciti
let validationFail: Validation
let validationSuccess: Validation

const message = (value, key, path): string => {
  return `${value}|${key}|${path}`
}

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
describe('Class property - flat', () => {
  test('Single validation', () => {
    const name = 'Sam'
    const lastName = 'Fisher'
    const nameError = {
      error: true,
      missing: false,
      value: name,
      field: 'name',
      path: 'name',
      message: message(name, 'name', 'name'),
    }
    const lastNameError = {
      error: true,
      missing: false,
      value: lastName,
      field: 'lastName',
      path: 'lastName',
      message: message(lastName, 'lastName', 'lastName'),
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
    class Person {
      @check(validationFail)
      name: string

      @check(validationFail)
      lastName: string
    }
    const person = new Person()
    person.name = name
    person.lastName = lastName

    const result = validateClass(person)

    expect(result).toEqual(expect.objectContaining(expectedResult))
  })

  test('Multiple validations', () => {
    const name = 'Sam'
    const lastName = 'Fisher'
    const nameError = {
      error: true,
      missing: false,
      value: name,
      field: 'name',
      path: 'name',
      message: message(name, 'name', 'name'),
    }
    const lastNameError = {
      error: false,
      missing: false,
      value: lastName,
      field: 'lastName',
      path: 'lastName',
      // message: message(lastName, 'lastName', 'lastName'),
      message: '',
    }
    const expectedResult = {
      valid: false,
      errors: [nameError],
      missing: [],
      struct: {
        name: nameError,
        lastName: lastNameError,
      },
    }
    class Person {
      @check([validationSuccess, validationSuccess, validationFail])
      name: string

      @check([validationSuccess, validationSuccess])
      lastName: string
    }

    const person = new Person()
    person.name = name
    person.lastName = lastName

    const result = validateClass(person)

    expect(result).toEqual(expect.objectContaining(expectedResult))
  })

  describe('Class property - nested', () => {
    test('Single validation', () => {
      const streetValue = 'street'
      const cityValue = 'city'
      const nameValue = 'Sam'
      const nameResult = {
        error: true,
        missing: false,
        value: nameValue,
        field: 'name',
        path: 'name',
        message: message(nameValue, 'name', 'name'),
      }

      const streetResult = {
        error: false,
        missing: false,
        value: streetValue,
        field: 'street',
        path: 'data.location.address.street',
        message: '',
      }

      const cityResult = {
        error: false,
        missing: false,
        value: cityValue,
        field: 'city',
        path: 'data.location.city',
        message: '',
      }
      const expectedResult = {
        valid: false,
        errors: [nameResult],
        missing: [],
        struct: {
          name: nameResult,
          data: {
            location: {
              city: cityResult,
              address: {
                street: streetResult,
              },
            },
          },
        },
      }
      class Person {
        @check({
          location: {
            city: validationSuccess,
            address: {
              street: validationSuccess,
            },
          },
        })
        data: any

        @check(validationFail)
        name: string = nameValue
      }

      const person = new Person()
      person.data = {
        location: {
          city: cityValue,
          address: {
            street: streetValue,
          },
        },
      }
      const result = validateClass(person)

      expect(result).toEqual(expect.objectContaining(expectedResult))
    })

    test('Multiple validations', () => {
      const streetValue = 'street'
      const cityValue = 'city'
      const nameValue = 'Sam'
      const nameResult = {
        error: true,
        missing: false,
        value: nameValue,
        field: 'name',
        path: 'name',
        message: message(nameValue, 'name', 'name'),
      }

      const streetResult = {
        error: false,
        missing: false,
        value: streetValue,
        field: 'street',
        path: 'data.location.address.street',
        message: '',
      }

      const cityResult = {
        error: false,
        missing: false,
        value: cityValue,
        field: 'city',
        path: 'data.location.city',
        message: '',
      }
      const expectedResult = {
        valid: false,
        errors: [nameResult],
        missing: [],
        struct: {
          name: nameResult,
          data: {
            location: {
              city: cityResult,
              address: {
                street: streetResult,
              },
            },
          },
        },
      }
      const citySpy = jest.fn(() => true)
      const streetSpy = jest.fn(() => true)
      class Person {
        @check({
          location: {
            city: [
              validationSuccess,
              validation({
                test: citySpy,
              }),
            ],
            address: {
              street: [
                validationSuccess,
                validation({
                  test: streetSpy,
                }),
              ],
            },
          },
        })
        data: any

        @check(validationFail)
        name: string = nameValue
      }

      const person = new Person()
      person.data = {
        location: {
          city: cityValue,
          address: {
            street: streetValue,
          },
        },
      }
      const result = validateClass(person)

      expect(result).toEqual(expect.objectContaining(expectedResult))
      expect(citySpy).toBeCalled()
      expect(streetSpy).toBeCalled()
    })
  })
})
