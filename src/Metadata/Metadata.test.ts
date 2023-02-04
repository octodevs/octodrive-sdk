import { describe, test, expect } from '@jest/globals'
import { Metadata } from './Metadata'

describe('Metadata class', () => {
  test('serialize & deserialize', () => {
    const a = new Metadata()

    const logicalPath = '/한글1234abcd'
    const physicalPath = '/abcd1234한글'

    a.set(logicalPath, physicalPath)

    const b = Metadata.deserialize(a.serialize())

    expect(a.get(logicalPath)).not.toBeUndefined()
    expect(b.get(logicalPath)).not.toBeUndefined()

    expect(a.get(physicalPath)).toBe(b.get(physicalPath))
  })
})
