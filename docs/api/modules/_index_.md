[validar-decorators](../README.md) › ["index"](_index_.md)

# External module: "index"


## Index

### Functions

* [isValid](_index_.md#isvalid)
* [validateClass](_index_.md#validateclass)
* [validateClassAsync](_index_.md#validateclassasync)

## Functions

###  isValid

▸ **isValid**(`validation`: Validation | Validation[] | any): *Function*

*Defined in [index.ts:11](https://github.com/ivandotv/validar-decorators/blob/a6a4210/src/index.ts#L11)*

Function for setting up decorator for validating class properties.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`validation` | Validation &#124; Validation[] &#124; any | validation to be used for validating class property |

**Returns:** *Function*

actual decorator

___

###  validateClass

▸ **validateClass**(`target`: any): *ValidationResult*

*Defined in [index.ts:29](https://github.com/ivandotv/validar-decorators/blob/a6a4210/src/index.ts#L29)*

Pass class instance or class itself to the [ validar package `validate` function](https://ivandotv.github.io/validar/validate)
to be validated.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | any | class or instance of a class |

**Returns:** *ValidationResult*

- [ validation result](https://ivandotv.github.io/validar/validate/validation-result.html )

___

###  validateClassAsync

▸ **validateClassAsync**(`target`: any): *Promise‹ValidationResult›*

*Defined in [index.ts:40](https://github.com/ivandotv/validar-decorators/blob/a6a4210/src/index.ts#L40)*

Pass class instance or class itself to the [ validar package `validateAsync` function](https://ivandotv.github.io/validar/validate/validate-async.html)
to be validated asynchronously.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | any | class or instance of a class |

**Returns:** *Promise‹ValidationResult›*

- [ validation result](https://ivandotv.github.io/validar/validate/validation-result.html )