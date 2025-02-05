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
          recordId: 'applicationLogEvent-1',
          data: Buffer.from(JSON.stringify(
              {
                "owner": "223851549868",
                "logGroup": "test-12_app_connector",
                "logStream": "connectorECSTaskId",
                "subscriptionFilters": [],
                "messageType": "DATA_MESSAGE",
                "logEvents": [
                    {
                        "id": "cloudwatch-log-message-id-1",
                        "timestamp": "1234",
                        "message": "Connector application log line 1"
                    },
                    {
                        "id": "cloudwatch-log-gmessage-id-2",
                        "timestamp": "12345",
                        "message": "Connector application log line 2"
                    }
                ]
                , ...overrides
              })
          ).toString('base64')
        },
        {
          approximateArrivalTimestamp: 1235,
          recordId: 'applicationLogEvent-2',
          data: Buffer.from(JSON.stringify(
              {
                "owner": "223851549868",
                "logGroup": "test-12_app_frontend",
                "logStream": "frontendECSTaskId",
                "subscriptionFilters": [],
                "messageType": "DATA_MESSAGE",
                "logEvents": [
                    {
                        "id": "cloudwatch-log-message-id-3>",
                        "timestamp": "12346",
                        "message": "Frontend application log line 3"
                    },
                    {
                        "id": "cloudwatch-log-message-id-4",
                        "timestamp": "12347",
                        "message": "Frontend application log line 4"
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

const expected_decoded_data_1 = `{"host":"connectorECSTaskId","source":"connector","sourcetype":"ST004:application_json","index":"pay_application","event":"Connector application log line 1","fields":{"account":"test","environment":"test-12"}}
{"host":"connectorECSTaskId","source":"connector","sourcetype":"ST004:application_json","index":"pay_application","event":"Connector application log line 2","fields":{"account":"test","environment":"test-12"}}`

    expect(result.records[0].result).toEqual('Ok')
    expect(result.records[0].recordId).toEqual('applicationLogEvent-1')
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(expected_decoded_data_1)

const expected_decoded_data_2 = `{"host":"frontendECSTaskId","source":"frontend","sourcetype":"ST004:application_json","index":"pay_application","event":"Frontend application log line 3","fields":{"account":"test","environment":"test-12"}}
{"host":"frontendECSTaskId","source":"frontend","sourcetype":"ST004:application_json","index":"pay_application","event":"Frontend application log line 4","fields":{"account":"test","environment":"test-12"}}`

    expect(result.records[1].result).toEqual('Ok')
    expect(result.records[1].recordId).toEqual('applicationLogEvent-2')
    expect(Buffer.from(result.records[1].data, 'base64').toString()).toEqual(expected_decoded_data_2)
  })

  test('should drop CloudWatch logs which are not DATA_MESSAGE', async () => {
    const result = await handler(anApplicationLogEvent({messageType: 'CONTROL'}))
    expect(result.records[0].result).toEqual('Dropped')
  })

  test('should error for unknown log type', () => {
    const unknownAppType =  anApplicationLogEvent({logGroup: "test-12_UNKNOWN_app"})
    const expectedErrorMessage = 'Error processing record "applicationLogEvent-1": Unknown log type of "UNKNOWN" taken from log group "test-12_UNKNOWN_app"'
    expect(async () => await handler(unknownAppType)).rejects.toThrow(expectedErrorMessage)
  })

  test('should error for invalid log group format', () => {
    const unknownAppType =  anApplicationLogEvent({logGroup: "invalid"})
    const expectedErrorMessage = 'Error processing record "applicationLogEvent-1": Log group "invalid" must be of format <env>_<type>_<optional subtype>'
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
              Logs: ['some alb log line 1', 'some alb log line 2']
            }
          ))
        }
      ]
    }

    // noinspection TypeScriptValidateTypes
    const result = await handler(anALBLogEvent)

const expected_decoded_data = `{"host":"test-12-connector-alb","source":"ALB","sourcetype":"aws:elb:accesslogs","index":"pay_ingress","event":"some alb log line 1","fields":{"account":"test","environment":"test-12"}}
{"host":"test-12-connector-alb","source":"ALB","sourcetype":"aws:elb:accesslogs","index":"pay_ingress","event":"some alb log line 2","fields":{"account":"test","environment":"test-12"}}`

    expect(result.records[0].result).toEqual('Ok')
    expect(result.records[0].recordId).toEqual('albLogEvent-1')
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(expected_decoded_data)
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
              Logs: ['some s3 access log line 1', 'some s3 access log line 2']
            }
          ))
        }
      ]
    }

    const result = await handler(anS3LogEvent)

const expected_decoded_data = `{"host":"the-actual-bucket","source":"S3","sourcetype":"aws:s3:accesslogs","index":"pay_access","event":"some s3 access log line 1","fields":{"account":"test","environment":"test-12"}}
{"host":"the-actual-bucket","source":"S3","sourcetype":"aws:s3:accesslogs","index":"pay_access","event":"some s3 access log line 2","fields":{"account":"test","environment":"test-12"}}`

    expect(result.records[0].result).toEqual('Ok')
    expect(result.records[0].recordId).toEqual('s3LogEvent-1')
    expect(Buffer.from(result.records[0].data, 'base64').toString()).toEqual(expected_decoded_data)
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
