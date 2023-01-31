import CryptoJS from 'crypto-js'

export const bitflip = (n: number): number =>
  n < 0
    ? parseInt(
        (-n)
          .toString(2)
          .padStart(32, '0')
          .split('')
          .map((v) => (v === '0' ? '1' : '0'))
          .join(''),
        2
      ) + 1
    : n

export const bitflipWords = (
  word: CryptoJS.lib.WordArray
): CryptoJS.lib.WordArray =>
  CryptoJS.lib.WordArray.create([...word.words.map(bitflip)], word.sigBytes)
