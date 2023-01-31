/*

  // ENCRPYTED DATA FILE STRUCTURE

  - MAGIC BYTES = 0x0C20DE00 <- O-C-two-O D(riv)E ENCRYPTED DATA FILE)
  - IV (32 bytes)
  - Salt (16 bytes)
  - AES/CTR/PKCS7 DATA (n bytes)

*/

import CryptoJS from 'crypto-js'
import { MagicByteInvalidError, TooShortPayloadError } from '../Exceptions'
import { bitflipWords } from '../utils'

const AES_OPTIONS = {
  mode: CryptoJS.mode.CTR,
  padding: CryptoJS.pad.Pkcs7,
}

export class EncryptedData {
  public static readonly MAGIC_BYTES = '\x0C\x20\xDE\x00' as string

  private constructor(
    public readonly cipherParams: CryptoJS.lib.CipherParams
  ) {}

  public static from(cipherText: string): EncryptedData
  public static from(plainText: string, password: string): EncryptedData
  public static from(
    plainOrCipherText: string,
    password?: string
  ): EncryptedData {
    const isPlainText = password !== undefined

    if (isPlainText) {
      const encoded = CryptoJS.enc.Utf8.parse(plainOrCipherText)
      const cipher = CryptoJS.AES.encrypt(encoded, password ?? '', AES_OPTIONS)

      return new EncryptedData(cipher)
    }

    if (!plainOrCipherText.startsWith(EncryptedData.MAGIC_BYTES)) {
      throw new MagicByteInvalidError()
    }

    if (plainOrCipherText.length < 4 + 32 + 16) {
      throw new TooShortPayloadError()
    }

    const cipher = CryptoJS.lib.CipherParams.create({
      iv: bitflipWords(
        CryptoJS.enc.Hex.parse(plainOrCipherText.substring(4, 4 + 32))
      ),
      salt: bitflipWords(
        CryptoJS.enc.Hex.parse(plainOrCipherText.substring(4 + 32, 4 + 32 + 16))
      ),
      ciphertext: bitflipWords(
        CryptoJS.enc.Hex.parse(plainOrCipherText.substring(4 + 32 + 16))
      ),
    })

    return new EncryptedData(cipher)
  }

  public decrypt(password: string): string {
    const decrypted = CryptoJS.AES.decrypt(
      this.cipherParams,
      password,
      AES_OPTIONS
    )

    return CryptoJS.enc.Utf8.stringify(decrypted)
  }

  public toString(): string {
    const stringifed =
      EncryptedData.MAGIC_BYTES +
      this.cipherParams.iv.toString(CryptoJS.enc.Hex) +
      this.cipherParams.salt.toString(CryptoJS.enc.Hex) +
      this.cipherParams.ciphertext.toString(CryptoJS.enc.Hex)

    return stringifed
  }
}
