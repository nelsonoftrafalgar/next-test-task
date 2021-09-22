import { ILogData } from 'utils/buildLogData'
import Transport from 'winston-transport'
import TransportStream from 'winston-transport'
import { createLogger } from 'winston'
import { logger } from './logger'

class CustomTransport extends Transport {
  constructor(opts: TransportStream.TransportStreamOptions) {
    super(opts)
  }
  log(info: ILogData, callback: () => void) {
    logger(JSON.stringify(info))
    callback()
  }
}

const transport = new CustomTransport({})

export const winstonLogger = createLogger({
  transports: [transport],
})
