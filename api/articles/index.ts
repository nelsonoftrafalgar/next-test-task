import { IDataItem, ISingleArticle } from './types'
import axios, { AxiosRequestConfig } from 'axios'

export interface IAxiosRequestCustomConfig extends AxiosRequestConfig {
  meta: {
    requestStartedAt: number
    responseEndedAt?: number
    elapsedTime?: string
  }
}

interface IAxiosCustomResponse {
  data: any
  status: number
  statusText: string
  headers: any
  config: IAxiosRequestCustomConfig
  request?: any
}

axios.interceptors.request.use((config) => {
  const customConfig = { ...config } as IAxiosRequestCustomConfig
  customConfig.meta = { requestStartedAt: new Date().getTime() }
  return customConfig
})

axios.interceptors.response.use((response) => {
  const customResponse = { ...response } as IAxiosCustomResponse
  customResponse.config.meta.responseEndedAt = new Date().getTime()
  customResponse.config.meta.elapsedTime = `${
    customResponse.config.meta.responseEndedAt -
    customResponse.config.meta.requestStartedAt
  }ms`
  return customResponse
})

export const getInitialArticles = async () => {
  const { data } = await axios.get<{ articles: IDataItem[] }>(
    'https://listapi.aripaev.ee/v1/category?categories=cm&exclude_categories=static&exclude_uuids=&limit=6&page=1',
    {
      headers: {
        'X-Channel-Id': 'laanevirumaa',
      },
    }
  )
  return data
}

export const getSingleArticle = async (url: string) => {
  const response = await axios.get<ISingleArticle>(
    `https://frontcontentapi.aripaev.ee/v2/article?url=${url}&body=1`,
    {
      headers: {
        'X-Url': url,
        'X-Channel-Id': 'laanevirumaa',
      },
    }
  )
  return response.data
}
