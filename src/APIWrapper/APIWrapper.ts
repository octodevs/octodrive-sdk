import { EncryptedData } from '../EncryptedData/EncryptedData'
import { Metadata } from '../Metadata/Metadata'
import {
  METADATA_STORAGE_ENDPOINT,
  FILE_STORAGE_ENDPOINT,
  FILE_API_ENDPOINT,
} from './APIEndpoints'
import type { DELETEFetcher, GETFetcher, POSTFetcher } from './APIFetcher'
import { hashSHA3 } from '../utils'

export class APIWrapper {
  constructor(
    private readonly baseURL: string,
    private readonly getFetcher: GETFetcher,
    private readonly postFetcher: POSTFetcher,
    private readonly deleteFetcher: DELETEFetcher
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

    const encrypted = EncryptedData.deserialize(rawData)
    const decrypted = encrypted.decrypt(password)

    return Metadata.deserialize(decrypted)
  }

  public async getMetadataByUsername(
    username: string,
    password: string
  ): Promise<Metadata> {
    const metadataId = hashSHA3(`${username}\x00${password}`)

    return await this.getMetadataById(metadataId, password)
  }

  public async getFile(fileId: string): Promise<EncryptedData> {
    const url = new URL(FILE_STORAGE_ENDPOINT(fileId), this.baseURL).toString()

    const rawData = await this.getFetcher({ url })
    const encrypted = EncryptedData.deserialize(rawData)

    return encrypted
  }

  public async postMetadata(
    metadataId: string,
    metadata: EncryptedData
  ): Promise<void> {
    const url = new URL(FILE_API_ENDPOINT(), this.baseURL)

    url.searchParams.set('type', 'METADATAS')

    await this.postFetcher({
      fileName: metadataId,
      fileData: metadata.serialize(),
      url: url.toString(),
    })
  }

  public async postFile(file: EncryptedData): Promise<string> {
    const url = new URL(FILE_API_ENDPOINT(), this.baseURL)

    url.searchParams.set('type', 'FILES')

    const rawData = await this.postFetcher({
      fileName: 'encrypted.bin',
      fileData: file.serialize(),
      url: url.toString(),
    })

    const data = new TextDecoder().decode(rawData)

    const result = JSON.parse(data) as { path: string }
    return result.path
  }

  public async deleteFile(fileId: string): Promise<void> {
    const url = new URL(FILE_API_ENDPOINT(fileId), this.baseURL).toString()

    await this.deleteFetcher({ url })
  }
}
