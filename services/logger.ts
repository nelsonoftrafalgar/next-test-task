import {
  CloudWatchLogsClient,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
  DescribeLogGroupsCommand,
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
  try {
    const data = await client.send(
      new DescribeLogGroupsCommand({ logGroupNamePrefix: logGroupName })
    )
    const isGroupNotFound = data.logGroups?.length === 0
    if (isGroupNotFound) {
      await client.send(new CreateLogGroupCommand({ logGroupName }))
    }
  } catch (error) {
    console.log('Create log group error', error)
  }
}

const createLogStream = async () => {
  try {
    const data = await client.send(
      new DescribeLogStreamsCommand({
        logGroupName,
        logStreamNamePrefix: logStreamName,
      })
    )
    const isStreamNotFound = data.logStreams?.length === 0
    if (isStreamNotFound) {
      await client.send(
        new CreateLogStreamCommand({
          logStreamName,
          logGroupName,
        })
      )
    }
  } catch (error) {
    console.log('Create log stream error', error)
  }
}

const sendLogEvent = async (message: string) => {
  try {
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
  } catch (error) {
    console.log('Send log event error', error)
  }
}

export const logger = async (message: string) => {
  await createLogGroup()
  await createLogStream()
  await sendLogEvent(message)
}
