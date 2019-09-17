## Validar Decorators

Decorators for the [validar package](https://github.com/ivandotv/validar).

## Install

```js
npm install validar-decorators
```

![CircleCI](https://img.shields.io/circleci/build/github/ivandotv/validar-decorators/master)
![Codecov](https://img.shields.io/codecov/c/github/ivandotv/validar-decorators)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/validar-decorators)
![NPM](https://img.shields.io/npm/l/validar-decorators)
![dependabot enabled](https://flat.badgen.net/dependabot/dependabot/dependabot-core/?icon=dependabot)

As decorators are a part of future [ECMAScript standard](https://github.com/tc39/proposals) they can only be used with transpilers such as [Babel](http://babeljs.io/) or [Typescript](https://www.typescriptlang.org/).

This package is written in typescript.

## Example

```js
// person.ts
import { isValid, validateClass, validateClassAsync } from 'validar-decorators'
import { validation } from 'validar'

class Person {
  // @isValid decorator accepts validation
  @isValid(validation(() => true))
  public name: string

  // or array of validations
  @isValid([validation(() => true),validation(() => true)])
  public lastName: string

  @isValid({
    address: {
      street: validation(() => true),
      appartmentNumber: validation(() => true),
    },
    city: validation(() => true),
    country: validation(() => false),
  })
  public location: Location
}
```

```js
// application.ts
const person = new Person()

person.name = 'Sam'
person.lastName = 'Fisher'
person.location = {
  address: {
    street: 'Beverly Hills',
    appartmentNumber: 33,
    city: 'LA',
    country: 'USA',
  },
}

// actual validation step
const result = validateClass(person)

// if you have async tests
validateClassAsync(person).then(result => {
  console.log(result)
})
```

### Static properties

You can also validate static properties.

```js
class Person {
  static totalCount: number = 3000
  static males: number = 1500
  static females: number = 1500
}

const result = validateClass(Person)

// if you have async tests
validateClassAsync(person).then(result => {
  console.log(result)
})
```

### Working with subclasses

Subclasses inherit validation checks from the parent class, but they can also override them.

```js
class Person {
  @isValid(validation(() => true))
  name: string = 'Sam'

  @isValid(validation(() => true))
  lastName: string
}

class Pilot extends Person {
  // override validation
  @isValid(validation(() => false))
  name: string

  // override validation
  @isValid(validation(() => false))
  lastName: string

  @isValid(validation(() => false))
  nick: string
}

const pilot = new Pilot()
pilot.name = 'Pete'
pilot.lastName = 'Mitchell'
pilot.nick = 'Maveric'

// actual validation step
const result = validateClass(pilot)
```

For more info about [`validar`](https://ivandotv.github.io/validar/) package check out the [documentation](https://ivandotv.github.io/validar/)

### API docs

`Validar Decorators` is written in TypeScript, [auto generated API docs](https://github.com/ivandotv/validar-decorators/blob/master/docs/api/README.md) are available.

##### Author

- **Ivan Vlatković**

##### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
