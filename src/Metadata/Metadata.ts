/*

  // METADATA FILE STRUCTURE

  - SIGNATURE (= 0x0C20DE01 <- O-C-two-O D(riv)E METADATA FILE)
  - FILE #1 LOGICAL PATH
  - 0x00
  - FILE #1 PHYSICAL PATH
  - 0x00
  - FILE #2 LOGICAL PATH
  - 0x00
  - FILE #2 PHYSICAL PATH
  - 0x00
  ...
  - FILE #n LOGICAL PATH
  - 0x00
  - FILE #n PHYSICAL PATH
  - 0x00

*/

import {
  SignatureBytesNotValid,
  TooShortPayloadError,
  MappingInvalidError,
} from '../Exceptions'

// Metadata is-a Map (key: logicalPath, value: physicalPath)
export class Metadata extends Map<string, string> {
  public static readonly SIGNATURE_BYTES = new Uint8Array([
    0x0c, 0x20, 0xde, 0x01,
  ])

  /**
   * Deserialize serialized metadata buffer to metadata object
   *
   * @param serialized serialized Uint8Array
   * @returns Deserialized metadata object
   */
  public static deserialize(serialized: Uint8Array): Metadata {
    if (serialized.length < 4) {
      throw new TooShortPayloadError()
    }

    const signatureBytes = serialized.subarray(0, 4)
    const pathBytes = serialized.subarray(4)

    if (!signatureBytes.every((v, i) => v === this.SIGNATURE_BYTES[i])) {
      throw new SignatureBytesNotValid()
    }

    const decoder = new TextDecoder()
    const serializedPaths = decoder.decode(pathBytes)

    const paths = serializedPaths
      .toString()
      .split('\x00')
      .filter((v) => v.length > 0)

    if (paths.length % 2 !== 0) {
      throw new MappingInvalidError()
    }

    const metadata = new Metadata()

    for (const [index] of paths.entries()) {
      if (index % 2 !== 0) {
        continue
      }

      const logicalPath = paths[index]
      const physicalPath = paths[index + 1]

      metadata.set(logicalPath, physicalPath)
    }

    return metadata
  }

  public serialize(): Uint8Array {
    const paths: string[] = []

    for (const [logicalPath, physicalPath] of this) {
      paths.push(logicalPath, physicalPath)
    }

    const encoder = new TextEncoder()
    const serializedPaths = encoder.encode(paths.join('\x00'))

    const serializedLength =
      Metadata.SIGNATURE_BYTES.length + serializedPaths.length

    const serialized = new Uint8Array(serializedLength)

    serialized.set(Metadata.SIGNATURE_BYTES, 0)
    serialized.set(serializedPaths, Metadata.SIGNATURE_BYTES.length)

    return serialized
  }
}
