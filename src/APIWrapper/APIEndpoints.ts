export const FILE_API_ENDPOINT = (fileId = ''): string => `/api/files/${fileId}`

export const METADATA_STORAGE_ENDPOINT = (metadataId: string): string =>
  `/metadatas/${metadataId}`

export const FILE_STORAGE_ENDPOINT = (fileId: string): string =>
  `/files/${fileId}`
