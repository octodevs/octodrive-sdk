export class SignatureBytesNotValid extends Error {
  constructor() {
    super('invalid signature bytes')
    this.name = 'SignatureBytesNotValid'
  }
}

export class TooShortPayloadError extends Error {
  constructor() {
    super('Payload too short')
    this.name = 'TooShortPayloadError'
  }
}

export class MappingInvalidError extends Error {
  constructor() {
    super('invalid physicalPath-logicalPath mapping')
    this.name = 'MappingInvalidError'
  }
}
