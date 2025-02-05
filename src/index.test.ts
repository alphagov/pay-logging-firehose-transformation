import { FirehoseTransformationEvent } from 'aws-lambda'
import { handler } from './index'

process.env.ENVIRONMENT = 'test-12'
process.env.ACCOUNT = 'test'


describe('Processing CloudWatchLogEvents', () => {
  function anApplicationLogEvent(overrides: object): FirehoseTransformationEvent {
    return {
      deliveryStreamArn: 'someDeliveryStreamArn',
      invocationId: 'someId',
      region: 'eu-west-1',
      records: [
        {
          approximateArrivalTimestamp: 1234,
          recordId: 'LogEvent-1',
          data: Buffer.from(JSON.stringify(
              {
                "owner": "223851549868",
                "logGroup": "test-12_app_connector",
                "logStream": "ECSTaskId",
                "subscriptionFilters": [],
                "messageType": "DATA_MESSAGE",
                "logEvents": [
                    {
                        "id": "cloudwatch-log-message-id-1",
                        "timestamp": "1234",
                        "message": "Log event message 1"
                    },
                    {
                        "id": "cloudwatch-log-gmessage-id-2",
                        "timestamp": "12345",
                        "message": "Log event message 2"
                    }
                ]
                , ...overrides
              })
          ).toString('base64')
        },
        {
          approximateArrivalTimestamp: 1235,
          recordId: 'LogEvent-2',
          data: Buffer.from(JSON.stringify(
              {
                "owner": "223851549868",
                "logGroup": "test-12_app_frontend",
                "logStream": "ECSTaskId",
                "subscriptionFilters": [],
                "messageType": "DATA_MESSAGE",
                "logEvents": [
                    {
                        "id": "cloudwatch-log-message-id-3>",
                        "timestamp": "12346",
                        "message": "Log event message 3"
                    },
                    {
                        "id": "cloudwatch-log-message-id-4",
                        "timestamp": "12347",
                        "message": "Log event message 4"
                    }
                ]
            })
          ).toString('base64')
        }
      ]
    }
  }

  test('should transform application logs from CloudWatch', async () => {
    // noinspection TypeScriptValidateTypes
    const result = await handler(anApplicationLogEvent())

    const expectedData = [{
      host: 'ECSTaskId',
      source: 'app',
      sourcetype: 'ST004:application_json',
      index: 'pay_application',
      event: 'Log event message 1',
      fields: {
        account: 'test',
        environment: 'test-12',
        service: 'connector'
      }
    },{
      host: 'ECSTaskId',
      source: 'app',
      sourcetype: 'ST004:application_json',
      index: 'pay_application',
      event: 'Log event message 2',
      fields: {
        account: 'test',
        environment: 'test-12',
        service: 'connector'
      }
    }].map((e) => JSON.stringify(e)).join('\n')

    expect(result.records[0].result).toEqual('Ok')
    expect(result.records[0].recordId).toEqual('LogEvent-1')
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(expectedData)

    const expectedData2 = [{
      host: 'ECSTaskId',
      source: 'app',
      sourcetype: 'ST004:application_json',
      index: 'pay_application',
      event: 'Log event message 3',
      fields: {
        account: 'test',
        environment: 'test-12',
        service: 'frontend',
      }
    },{
      host: 'ECSTaskId',
      source: 'app',
      sourcetype: 'ST004:application_json',
      index: 'pay_application',
      event: 'Log event message 4',
      fields: {
        account: 'test',
        environment: 'test-12',
        service: 'frontend'
      }
    }].map((e) => JSON.stringify(e)).join('\n')
    expect(result.records[1].result).toEqual('Ok')
    expect(result.records[1].recordId).toEqual('LogEvent-2')
    expect(Buffer.from(result.records[1].data, 'base64').toString()).toEqual(expectedData2)
  })

  test('should transform nginx forward proxy logs from CloudWatch', async () => {
    // noinspection TypeScriptValidateTypes
    const result = await handler(anApplicationLogEvent({logGroup:'test-12_nginx-forward-proxy_frontend'}))

    const expectedData = [{
      host: 'ECSTaskId',
      source: 'nginx-forward-proxy',
      sourcetype: 'nginx:plus:kv',
      index: 'pay_ingress',
      event: 'Log event message 1',
      fields: {
        account: 'test',
        environment: 'test-12',
        service: 'frontend'
      }
    },{
      host: 'ECSTaskId',
      source: 'nginx-forward-proxy',
      sourcetype: 'nginx:plus:kv',
      index: 'pay_ingress',
      event: 'Log event message 2',
      fields: {
        account: 'test',
        environment: 'test-12',
        service: 'frontend'
      }
    }].map((e) => JSON.stringify(e)).join('\n')

    expect(result.records[0].result).toEqual('Ok')
    expect(result.records[0].recordId).toEqual('LogEvent-1')
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(expectedData)
  })

  test('should transform nginx reverse proxy logs from CloudWatch', async () => {
    // noinspection TypeScriptValidateTypes
    const result = await handler(anApplicationLogEvent({logGroup:'test-12_nginx-reverse-proxy_frontend'}))

    const expectedData = [{
      host: 'ECSTaskId',
      source: 'nginx-reverse-proxy',
      sourcetype: 'nginx:plus:kv',
      index: 'pay_ingress',
      event: 'Log event message 1',
      fields: {
        account: 'test',
        environment: 'test-12',
        service: 'frontend'
      }
    },{
      host: 'ECSTaskId',
      source: 'nginx-reverse-proxy',
      sourcetype: 'nginx:plus:kv',
      index: 'pay_ingress',
      event: 'Log event message 2',
      fields: {
        account: 'test',
        environment: 'test-12',
        service: 'frontend'
      }
    }].map((e) => JSON.stringify(e)).join('\n')

    expect(result.records[0].result).toEqual('Ok')
    expect(result.records[0].recordId).toEqual('LogEvent-1')
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(expectedData)
  })

  test('should drop CloudWatch logs which are not DATA_MESSAGE', async () => {
    const result = await handler(anApplicationLogEvent({messageType: 'CONTROL'}))
    expect(result.records[0].result).toEqual('Dropped')
  })

  test('should error for unknown log type', () => {
    const unknownAppType =  anApplicationLogEvent({logGroup: "test-12_UNKNOWN_app"})
    const expectedErrorMessage = 'Error processing record "LogEvent-1": Unknown log type of "UNKNOWN" taken from log group "test-12_UNKNOWN_app"'
    expect(async () => await handler(unknownAppType)).rejects.toThrow(expectedErrorMessage)
  })

  test('should error for invalid log group format', () => {
    const unknownAppType =  anApplicationLogEvent({logGroup: "invalid"})
    const expectedErrorMessage = 'Error processing record "LogEvent-1": Log group "invalid" must be of format <env>_<type>_<optional subtype>'
    expect(async () => await handler(unknownAppType)).rejects.toThrow(expectedErrorMessage)
  })
})

describe('Processing S3 Logs', () => {
  test('should transform ALB log from S3', async () => {
    const anALBLogEvent = {
      records: [
        {
          approximateArrivalTimestamp: 1234,
          recordId: 'albLogEvent-1',
          data: Buffer.from(JSON.stringify(
            {
              SourceFile: {
                S3Bucket: 'some-bucket',
                S3Key: 'some-key',
              },
              ALB: 'test-12-connector-alb',
              AWSAccountID: '223851549868',
              AWSAccountName: 'pay-test',
              Logs: ['alb log line 1', 'alb log line 2']
            }
          ))
        }
      ]
    }

    // noinspection TypeScriptValidateTypes
    const result = await handler(anALBLogEvent)

    const expectedData = [{
      host: 'test-12-connector-alb',
      source: 'ALB',
      sourcetype: 'aws:elb:accesslogs',
      index: 'pay_ingress',
      event: 'alb log line 1',
      fields: {
        account: 'test',
        environment: 'test-12'
      }
    },{
      host: 'test-12-connector-alb',
      source: 'ALB',
      sourcetype: 'aws:elb:accesslogs',
      index: 'pay_ingress',
      event: 'alb log line 2',
      fields: {
        account: 'test',
        environment: 'test-12'
      }
    }].map((e) => JSON.stringify(e)).join('\n')

    expect(result.records[0].result).toEqual('Ok')
    expect(result.records[0].recordId).toEqual('albLogEvent-1')
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(expectedData)
  })

  test('should transform S3 access from S3', async () => {
    const anS3LogEvent = {
      records: [
        {
          approximateArrivalTimestamp: 1234,
          recordId: 's3LogEvent-1',
          data: Buffer.from(JSON.stringify(
            {
              SourceFile: {
                S3Bucket: 'some-source-bucket',
                S3Key: 'some-source-key',
              },
              S3Bucket: 'the-actual-bucket',
              AWSAccountID: '223851549868',
              AWSAccountName: 'pay-test',
              Logs: ['s3 access log line 1', 's3 access log line 2']
            }
          ))
        }
      ]
    }

    const result = await handler(anS3LogEvent)

    const expectedData = [{
      host: 'the-actual-bucket',
      source: 'S3',
      sourcetype: 'aws:s3:accesslogs',
      index: 'pay_access',
      event: 's3 access log line 1',
      fields: {
        account: 'test',
        environment: 'test-12'
      }
    },{
      host: 'the-actual-bucket',
      source: 'S3',
      sourcetype: 'aws:s3:accesslogs',
      index: 'pay_access',
      event: 's3 access log line 2',
      fields: {
        account: 'test',
        environment: 'test-12'
      }
    }].map((e) => JSON.stringify(e)).join('\n')
    expect(result.records[0].result).toEqual('Ok')
    expect(result.records[0].recordId).toEqual('s3LogEvent-1')
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(expectedData)
  })
})

describe('General processing', () => {
  test('should error if event data is unknown format', async() => {
    const event = {
      records: [
        {
          data: Buffer.from(JSON.stringify({}))
        }
      ]
    }
    expect(async () => await handler(event)).rejects.toThrow('Cannot parse information from record data because it is an unregonised structure')
  })

  test('should error if ENVIRONMENT env var is not set', async() => {
    process.env.ACCOUNT = "test"
    process.env.ENVIRONMENT = ""
    expect(async () => await handler({})).rejects.toThrow('"ENVIRONMENT" env var is not set')
  })

  test('should error if ACCOUNT env var is not set', async() => {
    process.env.ENVIRONMENT = "test-12"
    process.env.ACCOUNT = ""
    expect(async () => await handler({})).rejects.toThrow('"ACCOUNT" env var is not set')
  })
})
