import { FirehoseTransformationEventRecord } from 'aws-lambda'
import { Fixture } from './general_fixtures'

export const anInvalidApplicationLogFirehoseTransformationEventRecord: FirehoseTransformationEventRecord = {
  approximateArrivalTimestamp: 1234,
  recordId: 'InvalidLogEvent-1',
  data: Buffer.from(JSON.stringify({
    owner: '223851549868',
    logGroup: 'badLogGroupName',
    logStream: 'frontendECSTaskId',
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
  })).toString('base64')
}

export const anApplicationLogCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'test-12_app_frontend',
        logStream: 'frontendECSTaskId',
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
      })).toString('base64')
    },
    {
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-2',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'test-12_app_connector',
        logStream: 'connectorECSTaskId',
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
      })).toString('base64')
    }
    ]
  },
  expected: {
    records: [{
      result: 'Ok',
      recordId: 'LogEvent-1',
      data: Buffer.from([
        {
          host: 'frontendECSTaskId',
          source: 'app',
          sourcetype: 'ST004:application_json',
          index: 'pay_application',
          event: 'Log event message 1',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          }
        },
        {
          host: 'frontendECSTaskId',
          source: 'app',
          sourcetype: 'ST004:application_json',
          index: 'pay_application',
          event: 'Log event message 2',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          }
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }, {
      result: 'Ok',
      recordId: 'LogEvent-2',
      data: Buffer.from([
        {
          host: 'connectorECSTaskId',
          source: 'app',
          sourcetype: 'ST004:application_json',
          index: 'pay_application',
          event: 'Log event message 1',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'connector'
          }
        },
        {
          host: 'connectorECSTaskId',
          source: 'app',
          sourcetype: 'ST004:application_json',
          index: 'pay_application',
          event: 'Log event message 2',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'connector'
          }
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}
