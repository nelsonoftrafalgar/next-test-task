import {
  CloudWatchLogsClient,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
  DescribeLogStreamsCommand,
  PutLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs'

const logGroupName = 'next-test-task-log-goup'
const logStreamName = `${
  new Date().toISOString().split('T')[0]
}/next-test-task-log-stream`

const client = new CloudWatchLogsClient({
  region: process.env.REGION,
  credentials: {
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    accessKeyId: process.env.ACCESS_KEY_ID!,
  },
})

const createLogGroup = async () => {
  await client.send(new CreateLogGroupCommand({ logGroupName }))
}

const createLogStream = async () => {
  await client.send(
    new CreateLogStreamCommand({
      logStreamName,
      logGroupName,
    })
  )
}

const sendLogEvent = async (message: string) => {
  const describeLogStreams = new DescribeLogStreamsCommand({ logGroupName })
  const res = await client.send(describeLogStreams)
  const currentLogStream = res.logStreams?.find(
    (el) => el.logStreamName === logStreamName
  )

  const logEvents = new PutLogEventsCommand({
    logGroupName,
    logStreamName: currentLogStream?.logStreamName,
    logEvents: [{ timestamp: Date.now(), message }],
    sequenceToken: currentLogStream?.uploadSequenceToken,
  })
  await client.send(logEvents)
}

export const logger = async (message: string) => {
  console.log('log message', message)
  try {
    await createLogGroup()
    await createLogStream()
    await sendLogEvent(message)
  } catch {
    try {
      await createLogStream()
      await sendLogEvent(message)
    } catch {
      await sendLogEvent(message)
    }
  }
}
