export class MagicByteInvalidError extends Error {
  constructor() {
    super('invalid magic bytes')
    this.name = 'MagicByteInvalidError'
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
