[validar-decorators](../README.md) › ["index"](_index_.md)

# External module: "index"


## Index

### Variables

* [metaKey](_index_.md#const-metakey)

### Functions

* [getValidators](_index_.md#getvalidators)
* [initMetadata](_index_.md#initmetadata)
* [isValid](_index_.md#isvalid)
* [validateClass](_index_.md#validateclass)
* [validateClassAsync](_index_.md#validateclassasync)

## Variables

### `Const` metaKey

• **metaKey**: *"__validar_metadata__"* = "__validar_metadata__"

*Defined in [index.ts:3](https://github.com/ivandotv/validar-decorators/blob/2648696/src/index.ts#L3)*

## Functions

###  getValidators

▸ **getValidators**(`target`: any, `metaKey`: string): *any*

*Defined in [index.ts:39](https://github.com/ivandotv/validar-decorators/blob/2648696/src/index.ts#L39)*

**Parameters:**

Name | Type |
------ | ------ |
`target` | any |
`metaKey` | string |

**Returns:** *any*

___

###  initMetadata

▸ **initMetadata**(`target`: any, `metaKey`: string): *any*

*Defined in [index.ts:17](https://github.com/ivandotv/validar-decorators/blob/2648696/src/index.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`target` | any |
`metaKey` | string |

**Returns:** *any*

___

###  isValid

▸ **isValid**(`validation`: Validation | Validation[] | any): *Function*

*Defined in [index.ts:5](https://github.com/ivandotv/validar-decorators/blob/2648696/src/index.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`validation` | Validation &#124; Validation[] &#124; any |

**Returns:** *Function*

___

###  validateClass

▸ **validateClass**(`target`: any): *ValidationResult*

*Defined in [index.ts:29](https://github.com/ivandotv/validar-decorators/blob/2648696/src/index.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`target` | any |

**Returns:** *ValidationResult*

___

###  validateClassAsync

▸ **validateClassAsync**(`target`: any): *Promise‹ValidationResult›*

*Defined in [index.ts:34](https://github.com/ivandotv/validar-decorators/blob/2648696/src/index.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`target` | any |

**Returns:** *Promise‹ValidationResult›*