/*

  // ENCRPYTED DATA FILE STRUCTURE

  - SIGNATURE = 0x0C20DE00 <- O-C-two-O D(riv)E ENCRYPTED DATA FILE)
  - IV (16 bytes)
  - Salt (8 bytes)
  - AES/CTR/PKCS7 DATA (n bytes)

*/

import CryptoJS from 'crypto-js'
import { SignatureBytesNotValid, TooShortPayloadError } from '../Exceptions'
import { uint8ArrayToWordArray, wordArrayToUint8Array } from '../utils'

const AES_OPTIONS = {
  mode: CryptoJS.mode.CTR,
  padding: CryptoJS.pad.Pkcs7,
}

export class EncryptedData {
  public static readonly SIGNATURE_BYTES = new Uint8Array([
    0x0c, 0x20, 0xde, 0x00,
  ])

  private constructor(
    public readonly cipherParams: CryptoJS.lib.CipherParams
  ) {}

  /**
   * Deserialize serialized encrypted buffer to encrypted object
   *
   * @param serialized serialized Uint8Array
   * @returns Deserialized metadata object
   */
  public static deserialize(serialized: Uint8Array): EncryptedData {
    if (serialized.length < 4 + 16 + 8) {
      throw new TooShortPayloadError()
    }

    const signBytes = serialized.subarray(0, 4)

    if (!signBytes.every((v, i) => v === EncryptedData.SIGNATURE_BYTES[i])) {
      throw new SignatureBytesNotValid()
    }

    const ivBytes = serialized.subarray(4, 4 + 16)
    const saltBytes = serialized.subarray(4 + 16, 4 + 16 + 8)
    const encryptedBytes = serialized.subarray(4 + 16 + 8)

    const cipherParams = CryptoJS.lib.CipherParams.create({
      iv: uint8ArrayToWordArray(ivBytes),
      salt: uint8ArrayToWordArray(saltBytes),
      ciphertext: uint8ArrayToWordArray(encryptedBytes),
    })

    return new EncryptedData(cipherParams)
  }

  /**
   * Serialize encrypted data object
   *
   * @returns serialized encrypted data buffer
   */
  public serialize(): Uint8Array {
    const ivBytes = wordArrayToUint8Array(this.cipherParams.iv)
    const saltBytes = wordArrayToUint8Array(this.cipherParams.salt)
    const encryptedBytes = wordArrayToUint8Array(this.cipherParams.ciphertext)

    const serialized = new Uint8Array(
      EncryptedData.SIGNATURE_BYTES.length +
        ivBytes.length +
        saltBytes.length +
        encryptedBytes.length
    )

    serialized.set(EncryptedData.SIGNATURE_BYTES, 0)
    serialized.set(ivBytes, EncryptedData.SIGNATURE_BYTES.length)
    serialized.set(
      saltBytes,
      EncryptedData.SIGNATURE_BYTES.length + ivBytes.length
    )
    serialized.set(
      encryptedBytes,
      EncryptedData.SIGNATURE_BYTES.length + ivBytes.length + saltBytes.length
    )

    return serialized
  }

  /**
   * Encrypt plain text with given password
   *
   * @param plainText plain text buffer
   * @param password encryption key
   * @returns encrypted data
   */
  public static encrypt(
    plainText: Uint8Array,
    password: string
  ): EncryptedData {
    const plainWord = uint8ArrayToWordArray(plainText)
    const encrypted = CryptoJS.AES.encrypt(plainWord, password, AES_OPTIONS)

    return new EncryptedData(encrypted)
  }

  /**
   * Decrypt cipher text with given password
   *
   * @param password encryption key
   * @returns decrypted buffer
   */
  public decrypt(password: string): Uint8Array {
    const decrypted = CryptoJS.AES.decrypt(
      this.cipherParams,
      password,
      AES_OPTIONS
    )

    return wordArrayToUint8Array(decrypted)
  }
}
