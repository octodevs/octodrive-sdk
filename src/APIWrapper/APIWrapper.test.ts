import { describe, test, expect } from '@jest/globals'
import { EncryptedData } from '../EncryptedData/EncryptedData'
import { Metadata } from '../Metadata/Metadata'
import type { POSTFetcher, GETFetcher, DELETEFetcher } from './APIFetcher'
import { APIWrapBuilder } from './APIWrapBuilder'

describe('APIWrapper class', () => {
  test('getMetadataById', async () => {
    const baseURL = 'http://localhost:3000'
    const metadataId = 'FOO'
    const metadataPassword = 'BAR'
    const metadataPath = 'http://localhost:3000/metadatas/FOO'

    const mockMetadata = new Metadata()

    mockMetadata.set('FOO', 'BAR')

    const mockFetcher: GETFetcher = ({ url }) => {
      expect(url).toBe(metadataPath)

      return EncryptedData.from(
        mockMetadata.toString(),
        metadataPassword
      ).toString()
    }

    const api = new APIWrapBuilder()
      .setBaseURL(baseURL)
      .setGetFetcher(mockFetcher)
      .build()

    const catched = await api.getMetadataById(metadataId, metadataPassword)

    expect(catched.get('FOO')).toBe('BAR')
  })

  test('getMetadataByUsername', async () => {
    const baseURL = 'http://localhost:3000'

    const metadataUsername = 'FOO'
    const metadataPassword = 'BAR'

    const metadataPath =
      'http://localhost:3000/metadatas/bf9de9f02b0a4404235183b06bb1da1fd36a5d1b1ae01de90acc150ece81b3582d0c0fb3834bcd19d4835d2164152880d570510683835312f2269c5ea6efcf5a'

    const mockMetadata = new Metadata()

    mockMetadata.set('FOO', 'BAR')

    const mockFetcher: GETFetcher = ({ url }) => {
      expect(url).toBe(metadataPath)

      return EncryptedData.from(
        mockMetadata.toString(),
        metadataPassword
      ).toString()
    }

    const api = new APIWrapBuilder()
      .setBaseURL(baseURL)
      .setGetFetcher(mockFetcher)
      .build()

    const catched = await api.getMetadataByUsername(
      metadataUsername,
      metadataPassword
    )

    expect(catched.get('FOO')).toBe('BAR')
  })

  test('postMetadata', () => {
    const baseURL = 'http://localhost:3000'
    const fileApiPath = 'http://localhost:3000/api/files/?type=METADATAS'
    const metadataId = 'FOO'
    const metadataPassword = 'BAR'
    const metadata = new Metadata()

    metadata.set('FOO', 'BAR')

    const encrypted = EncryptedData.from(metadata.toString(), metadataPassword)

    const mockFetcher: POSTFetcher = ({ url, fileData, fileName }) => {
      const recvEncrypted = EncryptedData.from(fileData)
      const recvMetadata = Metadata.from(
        recvEncrypted.decrypt(metadataPassword)
      )

      expect(url).toBe(fileApiPath)
      expect(fileName).toBe(metadataId)
      expect(recvMetadata.get('FOO')).toBe('BAR')

      return ''
    }

    const api = new APIWrapBuilder()
      .setBaseURL(baseURL)
      .setPostFetcher(mockFetcher)
      .build()

    void api.postMetadata(metadataId, encrypted)
  })

  test('postFile', async () => {
    const baseURL = 'http://localhost:3000'
    const fileApiPath = 'http://localhost:3000/api/files/?type=FILES'

    const plainText = 'FOO'
    const password = 'BAR'
    const path = 'FOO'

    const encrypted = EncryptedData.from(plainText, password)

    const mockFetcher: POSTFetcher = ({ url, fileData }) => {
      const decrypted = EncryptedData.from(fileData).decrypt(password)

      expect(url).toBe(fileApiPath)
      expect(decrypted).toBe(plainText)

      return JSON.stringify({
        path,
      })
    }

    const api = new APIWrapBuilder()
      .setBaseURL(baseURL)
      .setPostFetcher(mockFetcher)
      .build()

    const recvPath = await api.postFile(encrypted)

    expect(recvPath).toBe(path)
  })

  test('deleteFile', () => {
    const baseURL = 'http://localhost:3000'

    const fileId = 'FOO'
    const fileApiPath = 'http://localhost:3000/api/files/FOO'

    const mockFetcher: DELETEFetcher = ({ url }) => {
      expect(url).toBe(fileApiPath)

      return ''
    }

    const api = new APIWrapBuilder()
      .setBaseURL(baseURL)
      .setDeleteFetcher(mockFetcher)
      .build()

    void api.deleteFile(fileId)
  })
})
