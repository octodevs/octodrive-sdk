export interface GETFetchData {
  url: string
}

export type GETFetcher = (
  data: GETFetchData
) => Promise<Uint8Array> | Uint8Array

export interface POSTFetchData {
  url: string
  fileName: string
  fileData: Uint8Array
}

export type POSTFetcher = (
  data: POSTFetchData
) => Promise<Uint8Array> | Uint8Array

export interface DELETEFetchData {
  url: string
}

export type DELETEFetcher = (
  data: DELETEFetchData
) => Promise<Uint8Array> | Uint8Array
