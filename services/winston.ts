import { ILogData } from 'utils/buildLogData'
import Transport from 'winston-transport'
import TransportStream from 'winston-transport'
import { createLogger } from 'winston'
import { logger } from './logger'

class CustomTransport extends Transport {
  constructor(opts: TransportStream.TransportStreamOptions) {
    super(opts)
  }
  async log(info: ILogData, callback: () => void) {
    await logger(JSON.stringify(info))
    callback()
  }
}

const transport = new CustomTransport({})

export const winstonLogger = createLogger({
  transports: [transport],
})
