export class MagicByteInvalidError extends Error {
  constructor () {
    super('invalid magic bytes')
    this.name = 'MagicByteInvalidError'
  }
}

export class MappingInvalidError extends Error {
  constructor () {
    super('invalid physicalPath-logicalPath mapping')
    this.name = 'MappingInvalidError'
  }
}
