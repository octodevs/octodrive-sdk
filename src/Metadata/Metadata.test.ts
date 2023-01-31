import { describe, test, expect } from '@jest/globals'
import { Metadata } from './Metadata'

describe('Metadata class', () => {
  test('parse method must work', () => {
    const stringified = '\x0C\x20\xDE\x01/foo\x00/bar'
    const metadata = Metadata.from(stringified)

    expect(metadata.get('/foo')).toBe('/bar')
  })

  test('parse invalid string must be thrown', () => {
    const invalidStringifed = 'FOOBAR'

    expect(() => {
      Metadata.from(invalidStringifed)
    }).toThrow()
  })

  test('parse odd paths must be thrown', () => {
    const invalidStringifed = '\x0C\x20\xDE\x01/foo\x00/bar\x00/evil'

    expect(() => {
      Metadata.from(invalidStringifed)
    }).toThrow()
  })

  test('stringify method must work', () => {
    const metadata = new Metadata()
    metadata.set('/foo', '/bar')

    expect(metadata.toString()).toBe('\x0C\x20\xDE\x01/foo\x00/bar')
  })

  test('stringifed text must be parse-able', () => {
    const a = new Metadata()
    a.set('/foo', '/bar')

    const b = Metadata.from(a.toString())

    expect(a.get('/foo')).not.toBeUndefined()
    expect(b.get('/foo')).not.toBeUndefined()

    expect(a.get('/foo')).toBe(b.get('/foo'))
  })
})
