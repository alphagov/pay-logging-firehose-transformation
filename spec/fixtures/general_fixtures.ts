import { Callback, Context, FirehoseTransformationEvent, FirehoseTransformationResult } from 'aws-lambda'

export type Fixture = {
  input: FirehoseTransformationEvent
  expected: FirehoseTransformationResult
}

export const mockCallback: Callback = () => undefined

export const mockContext: Context = {
  awsRequestId: '246fc613-8e0d-482a-9df5-158f2add0665',
  callbackWaitsForEmptyEventLoop: true,
  done: () => console.log('Complete'),
  fail: () => console.log('Error'),
  functionName: 'firehoseTransform',
  functionVersion: '$LATEST',
  getRemainingTimeInMillis: () => 333,
  invokedFunctionArn: 'arn:aws:lambda:eu-west-2:987654321:function:firehoseTransform',
  logGroupName: '/aws/lambda/firehoseTransform',
  logStreamName: '2025/02/06/[$LATEST]123456',
  memoryLimitInMB: '256',
  succeed: () => console.log('Great Success')
}

export function aCloudWatchEventWith(overrides: object[]): FirehoseTransformationEvent {
  const defaultValues = {
    owner: '223851549868',
    logGroup: 'test-12_type_service',
    logStream: 'logStream',
    subscriptionFilters: [],
    messageType: 'DATA_MESSAGE',
    logEvents: [
      {
        id: 'cloudwatch-log-message-id-1',
        timestamp: '1234',
        message: 'Log event message 1'
      },
      {
        id: 'cloudwatch-log-gmessage-id-2',
        timestamp: '12345',
        message: 'Log event message 2'
      }
    ]
  }

  return {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: overrides.map((value, index) => {
      return {
        approximateArrivalTimestamp: 1234,
        recordId: `LogEvent-${index + 1}`,
        data: Buffer.from(JSON.stringify(
          {
            ...defaultValues,
            ...value
          })
        ).toString('base64')
      }
    })
  }
}
