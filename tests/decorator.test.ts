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

describe('Decorator function', () => {
  test('throw if there are multiple decorators on the same class field', () => {
    expect(() => {
      isValid(validationFail)(Person.prototype, 'name')
      isValid(validationFail)(Person.prototype, 'name')
    }).toThrow('one @isValid')
  })

  describe('Metadata', () => {
    test('create metadata for class properties', () => {
      isValid(validationFail)(Person.prototype, 'name')
      isValid(validationSuccess)(Person.prototype, 'lastName')

      const person = new Person()

      expect(Reflect.getMetadata(metaKey, person).name).toEqual(validationFail)
      expect(Reflect.getMetadata(metaKey, person).lastName).toEqual(
        validationSuccess
      )
    })

    test('add array of validations to the class property ', () => {
      isValid([validationFail, validationFail])(Person.prototype, 'name')

      const person = new Person()

      expect(Reflect.getMetadata(metaKey, person).name).toEqual([
        validationFail,
        validationFail,
      ])
    })

    test('add metadata to class static properties', () => {
      isValid(validationFail)(Person, 'name')
      isValid(validationSuccess)(Person, 'lastName')

      expect(Reflect.getMetadata(metaKey, Person).name).toEqual(validationFail)
      expect(Reflect.getMetadata(metaKey, Person).lastName).toEqual(
        validationSuccess
      )
    })

    test('add validation to class properties that are deeply nested', () => {
      const validatorsResult = {
        locationInfo: {
          location: {
            city: [validationSuccess, validationFail],
            address: {
              street: [validationSuccess, validationSuccess],
            },
          },
        },
      }

      isValid({
        location: {
          city: [validationSuccess, validationFail],
          address: {
            street: [validationSuccess, validationSuccess],
          },
        },
      })(Person.prototype, 'locationInfo')

      const person = new Person()
      expect(Reflect.getMetadata(metaKey, person)).toEqual(validatorsResult)
    })

    test('add validation to static properties that are deeply nested', () => {
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

      expect(Reflect.getMetadata(metaKey, Person)).toEqual(validatorsResult)
    })
  })

  describe('Class inheritance', () => {
    test('subclass inherits parent class validations', () => {
      isValid(validationFail)(Person.prototype, 'name')
      isValid(validationFail)(Person.prototype, 'lastName')

      const personSub = new PersonSub()

      expect(Reflect.getMetadata(metaKey, personSub).name).toEqual(
        validationFail
      )
      expect(Reflect.getMetadata(metaKey, personSub).lastName).toEqual(
        validationFail
      )
    })

    test('subclass inherits parent class static validations', () => {
      isValid(validationFail)(Person, 'address')
      isValid(validationFail)(Person, 'city')

      expect(Reflect.getMetadata(metaKey, PersonSub).address).toEqual(
        validationFail
      )
      expect(Reflect.getMetadata(metaKey, PersonSub).city).toEqual(
        validationFail
      )
    })

    test('override parent instance validations', () => {
      isValid(validationFail)(Person.prototype, 'name')
      isValid(validationFail)(Person.prototype, 'lastName')

      isValid(validationSuccess)(PersonSub.prototype, 'name')
      isValid(validationSuccess)(PersonSub.prototype, 'lastName')

      // eslint-disable-next-line
      const personSub = new PersonSub()

      expect(Reflect.getMetadata(metaKey, personSub).name).toEqual(
        validationSuccess
      )
      expect(Reflect.getMetadata(metaKey, personSub).lastName).toEqual(
        validationSuccess
      )
    })

    test('override parent static validations', () => {
      isValid(validationFail)(Person, 'address')
      isValid(validationFail)(Person, 'city')

      isValid(validationSuccess)(PersonSub, 'address')
      isValid(validationSuccess)(PersonSub, 'city')

      expect(Reflect.getMetadata(metaKey, PersonSub).address).toEqual(
        validationSuccess
      )
      expect(Reflect.getMetadata(metaKey, PersonSub).city).toEqual(
        validationSuccess
      )
    })
  })
})
