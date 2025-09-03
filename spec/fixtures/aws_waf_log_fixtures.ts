import { Fixture } from './general_fixtures'

export const anWAFCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'record-id-waf-logs',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'aws-waf-logs-test-12',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: 1740495533,
            message: '{"timestamp":1756899436824,"some":"json"}'
          }
        ]
      })).toString('base64')
    }]
  },
  expected: {
    records: [{
      result: 'Ok',
      recordId: 'record-id-waf-logs',
      data: Buffer.from([
        {
          host: 'logStream',
          source: 'waf',
          sourcetype: 'generic_single_line',
          index: 'pay_ingress',
          event: '{"timestamp":1756899436824,"some":"json"}',
          fields: {
            account: 'test',
            environment: 'test-12'
          },
          time: 1756899436824
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}
