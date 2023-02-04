import CryptoJS from 'crypto-js'

export const uint8ArrayToWordArray = (u8Array: Uint8Array): any => {
  const words: number[] = []

  let i = 0
  const len = u8Array.length

  while (i < len) {
    words.push(
      (u8Array[i++] << 24) |
        (u8Array[i++] << 16) |
        (u8Array[i++] << 8) |
        u8Array[i++]
    )
  }

  return {
    sigBytes: words.length * 4,
    words,
  }
}

export const wordArrayToUint8Array = (
  wordArray: CryptoJS.lib.WordArray
): Uint8Array => {
  const uint8array = new Uint8Array(wordArray.sigBytes)

  for (let i = 0x0; i < wordArray.sigBytes; i++) {
    uint8array[i] =
      (wordArray.words[i >>> 0x2] >>> (0x18 - (i % 0x4) * 0x8)) & 0xff
  }

  const notPaddingLength = uint8array.reduce(
    (prev, curr, i) => (curr !== 0 ? i : prev),
    0
  )

  return uint8array.subarray(0, notPaddingLength + 1)
}

export const hashSHA3 = (message: string): string =>
  CryptoJS.SHA3(message, { outputLength: 512 }).toString(CryptoJS.enc.Hex)
