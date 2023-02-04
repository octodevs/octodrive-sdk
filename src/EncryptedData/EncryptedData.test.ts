import { describe, expect, test } from '@jest/globals'
import { EncryptedData } from './EncryptedData'

describe('EncryptedData class', () => {
  test('encrypt & decrypt', () => {
    const plainText = 'abcd1234!@#$한글'
    const password = '한글!@#$abcd1234'

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const plainTextBuffer = encoder.encode(plainText)

    const encrypted = EncryptedData.encrypt(plainTextBuffer, password)
    const decrypted = encrypted.decrypt(password)

    const plainTextResult = decoder.decode(decrypted)

    expect(plainTextResult).toBe(plainText)
  })

  test('serialize & deserialize', () => {
    const plainText = 'abcd1234!@#$한글'
    const password = '한글!@#$abcd1234'

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const plainTextBuffer = encoder.encode(plainText)

    const encrypted1 = EncryptedData.encrypt(plainTextBuffer, password)
    const stringified1 = encrypted1.serialize()

    const encrypted2 = EncryptedData.deserialize(stringified1)
    const stringified2 = encrypted2.serialize()

    expect(stringified1.join()).toBe(stringified2.join())
    expect(decoder.decode(encrypted2.decrypt(password))).toBe(plainText)
  })
})
