import { describe, expect, test } from '@jest/globals'
import { EncryptedData } from './EncryptedData'

describe('EncryptedData class', () => {
  test('encrypting & decrypting plaintext must work', () => {
    const plainText = 'FOO'
    const password = 'BAR'

    const encrypted = EncryptedData.from(plainText, password)

    expect(encrypted.decrypt(password)).toBe(plainText)
  })

  test('stringify & parse ciphertext must work', () => {
    const plainText = 'FOO'
    const password = 'BAR'

    const encrypted1 = EncryptedData.from(plainText, password)
    const stringified1 = encrypted1.toString()

    const encrypted2 = EncryptedData.from(stringified1)
    const stringified2 = encrypted2.toString()

    expect(stringified1).toBe(stringified2)
    expect(encrypted2.decrypt(password)).toBe(plainText)
  })
})
