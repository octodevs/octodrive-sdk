import {
  type DELETEFetcher,
  type POSTFetcher,
  type GETFetcher,
} from './APIFetcher'
import { APIWrapper } from './APIWrapper'

export class APIWrapBuilder {
  private baseURL: string | undefined
  private getFetcher: GETFetcher = () => ''
  private postFetcher: POSTFetcher = () => ''
  private deleteFetcher: DELETEFetcher = () => ''

  public setBaseURL(baseURL: string): this {
    this.baseURL = baseURL

    return this
  }

  public setGetFetcher(getFetcher: GETFetcher): this {
    this.getFetcher = getFetcher

    return this
  }

  public setPostFetcher(postFetcher: POSTFetcher): this {
    this.postFetcher = postFetcher

    return this
  }

  public setDeleteFetcher(deleteFetcher: DELETEFetcher): this {
    this.deleteFetcher = deleteFetcher

    return this
  }

  public build(): APIWrapper {
    if (this.baseURL === undefined) {
      throw new TypeError('baseURL not defined')
    }

    return new APIWrapper(
      this.baseURL,
      this.getFetcher,
      this.postFetcher,
      this.deleteFetcher
    )
  }
}
