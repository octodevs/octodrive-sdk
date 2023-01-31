import { EncryptedData } from '../EncryptedData/EncryptedData'
import { Metadata } from '../Metadata/Metadata'
import { METADATA_STORAGE_ENDPOINT } from './APIEndpoints'
import type { GETFetcher, POSTFetcher } from './APIFetcher'
import { hashSHA3 } from '../utils'

export class APIWrapper {
  constructor(
    private readonly baseURL: URL,
    private readonly getFetcher: GETFetcher,
    private readonly postFetcher: POSTFetcher
  ) {}

  public async getMetadataById(
    metadataId: string,
    password: string
  ): Promise<Metadata> {
    const url = new URL(
      METADATA_STORAGE_ENDPOINT(metadataId),
      this.baseURL
    ).toString()

    const rawData = await this.getFetcher({ url })

    const encrypted = EncryptedData.from(rawData)
    const decrypted = encrypted.decrypt(password)

    return Metadata.from(decrypted)
  }

  public async getMetadataByUsername(
    username: string,
    password: string
  ): Promise<Metadata> {
    const metadataId = hashSHA3(`${username}\x00${password}`)

    return await this.getMetadataById(metadataId, password)
  }
}
