import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

import { IAxiosRequestCustomConfig } from 'api/articles'
import { IncomingHttpHeaders } from 'node:http'
import { IncomingMessage } from 'http'

export interface ILogData {
  api: {
    status: {
      code: number | undefined
      messsage: string | undefined
    }
    request: {
      headers: ReturnType<typeof parseApiResponseConfig>
    }
    response: {
      headers: AxiosResponse['headers']
    }
    time: IAxiosRequestCustomConfig['meta']
  }
  server?: {
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
      status: {
        code: apiResponse.status,
        messsage: apiResponse.statusText,
      },
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

export const buildErrorLogData = (
  errorResponse: AxiosError,
  req: IncomingMessage
): ILogData => {
  return {
    api: {
      status: {
        code: errorResponse.response?.status,
        messsage: errorResponse.response?.statusText,
      },
      request: {
        headers: parseApiResponseConfig(errorResponse.config),
      },
      response: {
        headers: errorResponse.response?.headers,
      },
      time: (errorResponse.config as IAxiosRequestCustomConfig).meta,
    },
    server: {
      request: {
        headers: req.headers,
      },
    },
  }
}

export const buildClientLogData = (apiResponse: AxiosResponse): ILogData => {
  return {
    api: {
      status: {
        code: apiResponse.status,
        messsage: apiResponse.statusText,
      },
      request: {
        headers: parseApiResponseConfig(apiResponse.config),
      },
      response: {
        headers: apiResponse.headers,
      },
      time: (apiResponse.config as IAxiosRequestCustomConfig).meta,
    },
  }
}
