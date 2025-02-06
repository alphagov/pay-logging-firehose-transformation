import { handler } from '../src/index'
import { anApplicationLogCloudWatchEvent, aCloudWatchEventWith, anNginxForwardProxyCloudWatchEvent, anNginxReverseProxyCloudWatchEvent, anS3AlbEvent, anS3AccessEvent } from './fixtures'

process.env.ENVIRONMENT = 'test-12'
process.env.ACCOUNT = 'test'


describe('Processing CloudWatchLogEvents', () => {
  test('should transform application logs from CloudWatch', async () => {
    const result = await handler(anApplicationLogCloudWatchEvent.input)

    const expectedFirstRecord = anApplicationLogCloudWatchEvent.expected.records[0]
    expect(result.records[0].result).toEqual(expectedFirstRecord.result)
    expect(result.records[0].recordId).toEqual(expectedFirstRecord.recordId)
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(Buffer.from(expectedFirstRecord.data, 'base64').toString())

    const expectedSecondRecord = anApplicationLogCloudWatchEvent.expected.records[1]
    expect(result.records[1].result).toEqual('Ok')
    expect(result.records[1].recordId).toEqual('LogEvent-2')
    expect(Buffer.from(result.records[1].data, 'base64').toString()).toEqual(Buffer.from(expectedSecondRecord.data, 'base64').toString())
  })

  test('should transform nginx forward proxy logs from CloudWatch', async () => {
    const result = await handler(anNginxForwardProxyCloudWatchEvent.input)

    const expected = anNginxForwardProxyCloudWatchEvent.expected.records[0]
    expect(result.records[0].result).toEqual(expected.result)
    expect(result.records[0].recordId).toEqual(expected.recordId)
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(Buffer.from(expected.data, 'base64').toString())
  })

  test('should transform nginx reverse proxy logs from CloudWatch', async () => {
    const result = await handler(anNginxReverseProxyCloudWatchEvent.input)

    const expected = anNginxReverseProxyCloudWatchEvent.expected.records[0]
    expect(result.records[0].result).toEqual(expected.result)
    expect(result.records[0].recordId).toEqual(expected.recordId)
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(Buffer.from(expected.data, 'base64').toString())
  })

  test('should drop CloudWatch logs which are not DATA_MESSAGE', async () => {
    const result = await handler(aCloudWatchEventWith([{ messageType: 'CONTROL' }]))
    expect(result.records[0].result).toEqual('Dropped')
  })

  test('should error for unknown log type', () => {
    const expectedErrorMessage = 'Error processing record "LogEvent-1": Unknown log type of "UNKNOWN" taken from log group "test-12_UNKNOWN_app"'
    expect(async () => await handler(aCloudWatchEventWith([{ logGroup: "test-12_UNKNOWN_app" }]))).rejects.toThrow(expectedErrorMessage)
  })

  test('should error for invalid log group format', () => {
    const expectedErrorMessage = 'Error processing record "LogEvent-1": Log group "invalid" must be of format <env>_<type>_<optional subtype>'
    expect(async () => await handler(aCloudWatchEventWith([{ logGroup: "invalid" }]))).rejects.toThrow(expectedErrorMessage)
  })
})

describe('Processing S3 Logs', () => {

  test('should transform ALB log from S3', async () => {
    // noinspection TypeScriptValidateTypes
    const result = await handler(anS3AlbEvent.input)

    const expected = anS3AlbEvent.expected.records[0]
    expect(result.records[0].result).toEqual(expected.result)
    expect(result.records[0].recordId).toEqual(expected.recordId)
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(Buffer.from(expected.data, 'base64').toString())
  })

  test('should transform S3 access from S3', async () => {
    const result = await handler(anS3AccessEvent.input)

    const expected = anS3AccessEvent.expected.records[0]
    expect(result.records[0].result).toEqual(expected.result)
    expect(result.records[0].recordId).toEqual(expected.recordId)
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(Buffer.from(expected.data, 'base64').toString())
  })
})

describe('General processing', () => {
  test('should error if event data is unknown format', async () => {
    const event = {
      records: [
        {
          data: Buffer.from(JSON.stringify({ unknown: 'invalid' }))
        }
      ]
    }
    expect(async () => await handler(event)).rejects.toThrow('Cannot parse information from record data because it is an unregonised structure')
  })

  test('should error if ENVIRONMENT env var is not set', async () => {
    process.env.ACCOUNT = "test"
    process.env.ENVIRONMENT = ""
    expect(async () => await handler({})).rejects.toThrow('"ENVIRONMENT" env var is not set')
  })

  test('should error if ACCOUNT env var is not set', async () => {
    process.env.ENVIRONMENT = "test-12"
    process.env.ACCOUNT = ""
    expect(async () => await handler({})).rejects.toThrow('"ACCOUNT" env var is not set')
  })
})
