export interface GETFetchData {
  url: string
}

export type GETFetcher = (data: GETFetchData) => Promise<string> | string

export interface POSTFetchData {
  url: string
  fileName: string
  fileData: string
}

export type POSTFetcher = (data: POSTFetchData) => Promise<string> | string

export interface DELETEFetchData {
  url: string
}

export type DELETEFetcher = (data: DELETEFetchData) => Promise<string> | string
