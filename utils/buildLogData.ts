import { AxiosRequestConfig, AxiosResponse } from 'axios'

import { IAxiosRequestCustomConfig } from 'api/articles'
import { IncomingHttpHeaders } from 'node:http'
import { IncomingMessage } from 'http'

export interface ILogData {
  api: {
    request: {
      headers: ReturnType<typeof parseApiResponseConfig>
    }
    response: {
      headers: AxiosResponse['headers']
    }
    time: IAxiosRequestCustomConfig['meta']
  }
  server: {
    request: {
      headers: IncomingHttpHeaders
    }
  }
}

const parseApiResponseConfig = ({
  url,
  method,
  headers,
}: AxiosRequestConfig) => {
  return {
    url,
    method,
    headers,
  }
}

export const buildLogData = (
  apiResponse: AxiosResponse,
  req: IncomingMessage
): ILogData => {
  return {
    api: {
      request: {
        headers: parseApiResponseConfig(apiResponse.config),
      },
      response: {
        headers: apiResponse.headers,
      },
      time: (apiResponse.config as IAxiosRequestCustomConfig).meta,
    },
    server: {
      request: {
        headers: req.headers,
      },
    },
  }
}
