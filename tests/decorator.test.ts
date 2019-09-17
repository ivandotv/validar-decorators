import { Validation, validation } from 'validar'
import { isValid } from '../src/index'

let validationFail: Validation
let validationSuccess: Validation

const metaKey: string = '__validar_metadata__'
// @ts-ignore
let Person: PersonClass, PersonSub: PersonSubClass

beforeEach(() => {
  Person = class PersonClass {
    name: string = 'Sam'
    lastName: string = 'Fisher'
    static address: string
    static city: string
  }

  PersonSub = class PersonSubClass extends Person {}
  validationFail = validation({
    test: () => true,
  })
  validationSuccess = validation({
    test: () => true,
  })
})

describe('isValid decorator', () => {
  test('throw if multiple decorators on the same field', () => {
    expect(() => {
      isValid(validationFail)(Person.prototype, 'name')
      isValid(validationFail)(Person.prototype, 'name')
    }).toThrow('one @isValid')
  })
})

describe('Create metadata', () => {
  test('instance properties', () => {
    isValid(validationFail)(Person.prototype, 'name')
    isValid(validationSuccess)(Person.prototype, 'lastName')

    const person = new Person()

    expect(person[metaKey].name).toEqual(validationFail)
    expect(person[metaKey].lastName).toEqual(validationSuccess)
  })

  test('instance properties - array of validations', () => {
    isValid([validationFail, validationFail])(Person.prototype, 'name')

    const person = new Person()

    expect(person[metaKey].name).toEqual([validationFail, validationFail])
  })

  test('class static properties', () => {
    isValid(validationFail)(Person, 'name')
    isValid(validationSuccess)(Person, 'lastName')

    expect(Person[metaKey].name).toEqual(validationFail)
    expect(Person[metaKey].lastName).toEqual(validationSuccess)
  })

  test('instance properties - deeply nested', () => {
    const validatorsResult = {
      name: {
        location: {
          city: [validationSuccess, validationFail],
          address: {
            street: [validationSuccess, validationSuccess],
          },
        },
      },
      lastName: validationFail,
    }

    isValid({
      location: {
        city: [validationSuccess, validationFail],
        address: {
          street: [validationSuccess, validationSuccess],
        },
      },
    })(Person.prototype, 'name')

    isValid(validationFail)(Person.prototype, 'lastName')

    const person = new Person()
    expect(person[metaKey]).toEqual(validatorsResult)
  })

  test('static properties - deeply nested', () => {
    const validatorsResult = {
      address: {
        location: {
          city: [validationSuccess, validationFail],
          address: {
            street: [validationSuccess, validationSuccess],
          },
        },
      },
      city: validationFail,
    }

    isValid({
      location: {
        city: [validationSuccess, validationFail],
        address: {
          street: [validationSuccess, validationSuccess],
        },
      },
    })(Person, 'address')
    isValid(validationFail)(Person, 'city')

    expect(Person[metaKey]).toEqual(validatorsResult)
  })
})

describe('Using inheritance', () => {
  test('subclass inherits instance validations', () => {
    isValid(validationFail)(Person.prototype, 'name')
    isValid(validationFail)(Person.prototype, 'lastName')

    const personSub = new PersonSub()

    expect(personSub[metaKey].name).toEqual(validationFail)
    expect(personSub[metaKey].lastName).toEqual(validationFail)
  })

  test('subclass inherits static validations', () => {
    isValid(validationFail)(Person, 'address')
    isValid(validationFail)(Person, 'city')

    expect(PersonSub[metaKey].address).toEqual(validationFail)
    expect(PersonSub[metaKey].city).toEqual(validationFail)
  })

  test('override parent instance validations', () => {
    isValid(validationFail)(Person.prototype, 'name')
    isValid(validationFail)(Person.prototype, 'lastName')

    isValid(validationSuccess)(PersonSub.prototype, 'name')
    isValid(validationSuccess)(PersonSub.prototype, 'lastName')

    const personSub = new PersonSub()

    expect(personSub[metaKey].name).toEqual(validationSuccess)
    expect(personSub[metaKey].lastName).toEqual(validationSuccess)
  })

  test('override parent static validations', () => {
    isValid(validationFail)(Person, 'address')
    isValid(validationFail)(Person, 'city')

    isValid(validationSuccess)(PersonSub, 'address')
    isValid(validationSuccess)(PersonSub, 'city')

    expect(PersonSub[metaKey].address).toEqual(validationSuccess)
    expect(PersonSub[metaKey].city).toEqual(validationSuccess)
  })
})
