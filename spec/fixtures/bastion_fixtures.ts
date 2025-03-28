import { Fixture } from './general_fixtures'

export const aBastionLogCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1111',
      data: Buffer.from(JSON.stringify({
        owner: '123456789',
        logGroup: 'test-12_bastion',
        logStream: 'bastionTaskId',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: '1234',
            message: '{"time":"2025-03-28T09:41:30.493596011Z","level":"INFO","msg":"Container started. Starting bastion service."}'
          }
        ]
      })).toString('base64')
    }
    ]
  },
  expected: {
    records: [{
      result: 'Ok',
      recordId: 'LogEvent-1111',
      data: Buffer.from([
        {
          host: 'bastionTaskId',
          source: 'bastion',
          sourcetype: 'linux_bastion',
          index: 'pay_host',
          event: '{"time":"2025-03-28T09:41:30.493596011Z","level":"INFO","msg":"Container started. Starting bastion service."}',
          fields: {
            account: 'test',
            environment: 'test-12'
          },
          time: 1743154890.493
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}
