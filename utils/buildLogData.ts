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
      headers: IncomingHttpHeaders | any
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

const getCircularReplacer = () => {
  const seen = new WeakSet()
  return (key: any, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return
      }
      seen.add(value)
    }
    return value
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
        headers: JSON.stringify(
          [req.connection, req.cookies],
          getCircularReplacer()
        ),
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
