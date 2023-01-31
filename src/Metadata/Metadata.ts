/*

  // METADATA FILE STRUCTURE

  - MAGIC BYTES (= 0x0C20DE01 <- O-C-two-O D(riv)E METADATA FILE)
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

import { MagicByteInvalidError, MappingInvalidError } from '../Exceptions'

// Metadata is-a Map (key: logicalPath, value: physicalPath)
export class Metadata extends Map<string, string> {
  public static readonly MAGIC_BYTES = '\x0C\x20\xDE\x01' as string

  /**
   * Parse stringified metadata
   *
   * @param stringified stringified metadata
   * @returns parsed metadata
   */
  public static from(stringified: string): Metadata {
    const metadata = new Metadata()

    if (!stringified.startsWith(this.MAGIC_BYTES)) {
      throw new MagicByteInvalidError()
    }

    // remove magic bytes from stringified and split by 0x00
    const paths = stringified.substring(this.MAGIC_BYTES.length).split('\x00')

    // if mappings count is odd throw an error
    if (paths.length % 2 === 1) {
      throw new MappingInvalidError()
    }

    for (const [currentPathIndex] of paths.entries()) {
      if (currentPathIndex % 2 === 1) {
        continue
      }

      // Even line paths -> logicalPath
      const logicalPath = paths[currentPathIndex]

      // Odd line paths -> physicalPath
      const physicalPath = paths[currentPathIndex + 1]

      metadata.set(logicalPath, physicalPath)
    }

    return metadata
  }

  /**
   * stringify metadata
   */
  public toString(): string {
    const paths = []

    for (const [logicalPath, physicalPath] of this) {
      paths.push(logicalPath, physicalPath)
    }

    return Metadata.MAGIC_BYTES + paths.join('\x00')
  }
}
