export interface GETFetchData {
  url: string
}

export type GETFetcher = (data: GETFetchData) => Promise<string> | string

export interface POSTFetchData {
  url: string
  fileName: string
  fileData: string
  contentType: 'application/octet-stream'
}

export type POSTFetcher = (data: POSTFetchData) => Promise<string> | string
