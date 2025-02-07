import { handler } from '../src/index'

import {
  anApplicationLogCloudWatchEvent,
  aCloudWatchEventWith,
  anInvalidApplicationLogFirehoseTransformationEventRecord,
  anNginxForwardProxyCloudWatchEvent,
  anNginxReverseProxyCloudWatchEvent,
  anS3AlbEvent,
  anS3AccessEvent,
  mockCallback,
  mockContext
} from './fixtures'

process.env.ENVIRONMENT = 'test-12'
process.env.ACCOUNT = 'test'


describe('Processing CloudWatchLogEvents', () => {
  test('should transform application logs from CloudWatch', async () => {
    const result = await handler(anApplicationLogCloudWatchEvent.input, mockContext, mockCallback)

    const expectedFirstRecord = anApplicationLogCloudWatchEvent.expected.records[0]
    expect(result.records[0].result).toEqual(expectedFirstRecord.result)
    expect(result.records[0].recordId).toEqual(expectedFirstRecord.recordId)
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(Buffer.from(expectedFirstRecord.data as string, 'base64').toString())

    const expectedSecondRecord = anApplicationLogCloudWatchEvent.expected.records[1]
    expect(result.records[1].result).toEqual('Ok')
    expect(result.records[1].recordId).toEqual('LogEvent-2')
    expect(Buffer.from(result.records[1].data, 'base64').toString()).toEqual(Buffer.from(expectedSecondRecord.data as string, 'base64').toString())
  })

  test('should transform nginx forward proxy logs from CloudWatch', async () => {
    const result = await handler(anNginxForwardProxyCloudWatchEvent.input, mockContext, mockCallback)

    const expected = anNginxForwardProxyCloudWatchEvent.expected.records[0]
    expect(result.records[0].result).toEqual(expected.result)
    expect(result.records[0].recordId).toEqual(expected.recordId)
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
  })

  test('should transform nginx reverse proxy logs from CloudWatch', async () => {
    const result = await handler(anNginxReverseProxyCloudWatchEvent.input, mockContext, mockCallback)

    const expected = anNginxReverseProxyCloudWatchEvent.expected.records[0]
    expect(result.records[0].result).toEqual(expected.result)
    expect(result.records[0].recordId).toEqual(expected.recordId)
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
  })

  test('should drop CloudWatch logs which are not DATA_MESSAGE', async () => {
    const result = await handler(aCloudWatchEventWith([{ messageType: 'CONTROL' }]), mockContext, mockCallback)
    expect(result.records[0].result).toEqual('Dropped')
  })

  test('should error for unknown log type', async () => {
    const result = await handler(aCloudWatchEventWith([{ logGroup: "test-12_UNKNOWN_app" }]), mockContext, mockCallback)
    expect(result.records[0].result).toEqual('ProcessingFailed')
    expect(result.records[0].recordId).toEqual('LogEvent-1')
  })

  test('should error for invalid log group format', async () => {
    const result = await handler(aCloudWatchEventWith([{ logGroup: "invalid" }]), mockContext, mockCallback)
    expect(result.records[0].result).toEqual('ProcessingFailed')
    expect(result.records[0].recordId).toEqual('LogEvent-1')
  })
})

describe('Processing S3 Logs', () => {
  test('should transform ALB log from S3', async () => {
    // noinspection TypeScriptValidateTypes
    const result = await handler(anS3AlbEvent.input, mockContext, mockCallback)

    const expected = anS3AlbEvent.expected.records[0]
    expect(result.records[0].result).toEqual(expected.result)
    expect(result.records[0].recordId).toEqual(expected.recordId)
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
  })

  test('should transform S3 access from S3', async () => {
    const result = await handler(anS3AccessEvent.input, mockContext, mockCallback)

    const expected = anS3AccessEvent.expected.records[0]
    expect(result.records[0].result).toEqual(expected.result)
    expect(result.records[0].recordId).toEqual(expected.recordId)
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
  })
})

describe('General processing', () => {
  test('when one bad record fails transformation other good records still succeed', async () => {
    const event = anApplicationLogCloudWatchEvent.input

    event.records = [
      event.records[0],
      anInvalidApplicationLogFirehoseTransformationEventRecord,
      event.records[1]
    ]

    const result = await handler(event, mockContext, mockCallback)

    const expectedFirstRecord = anApplicationLogCloudWatchEvent.expected.records[0]
    expect(result.records[0].result).toEqual(expectedFirstRecord.result)
    expect(result.records[0].recordId).toEqual(expectedFirstRecord.recordId)
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(Buffer.from(expectedFirstRecord.data as string, 'base64').toString())

    expect(result.records[1].result).toEqual('ProcessingFailed')
    expect(result.records[1].recordId).toEqual(anInvalidApplicationLogFirehoseTransformationEventRecord.recordId)

    const expectedThirdRecord = anApplicationLogCloudWatchEvent.expected.records[1]
    expect(result.records[2].result).toEqual('Ok')
    expect(result.records[2].recordId).toEqual('LogEvent-2')
    expect(Buffer.from(result.records[2].data, 'base64').toString()).toEqual(Buffer.from(expectedThirdRecord.data as string, 'base64').toString())
  })

  test('should error if event data is unknown format', async () => {
    const event = {
      records: [
        {
          recordId: 'testRecordId',
          data: Buffer.from(JSON.stringify({ unknown: 'invalid' }))
        }
      ]
    }
    const result = await handler(event, mockContext, mockCallback)
    expect(result.records[0].result).toEqual('ProcessingFailed')
    expect(result.records[0].recordId).toEqual('testRecordId')
  })

  test('should error if ENVIRONMENT env var is not set', async () => {
    process.env.ACCOUNT = "test"
    process.env.ENVIRONMENT = ""
    expect(async () => await handler({}, mockContext, mockCallback)).rejects.toThrow('"ENVIRONMENT" env var is not set')
  })

  test('should error if ACCOUNT env var is not set', async () => {
    process.env.ENVIRONMENT = "test-12"
    process.env.ACCOUNT = ""
    expect(async () => await handler({}, mockContext, mockCallback)).rejects.toThrow('"ACCOUNT" env var is not set')
  })
})
