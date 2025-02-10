import { Fixture } from './general_fixtures'

export const anNginxForwardProxyCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'test-12_nginx-forward-proxy_frontend',
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
      })).toString('base64')
    }]
  },
  expected: {
    records: [{
      result: 'Ok',
      recordId: 'LogEvent-1',
      data: Buffer.from([
        {
          host: 'logStream',
          source: 'nginx-forward-proxy',
          sourcetype: 'nginx:plus:kv',
          index: 'pay_ingress',
          event: 'Log event message 1',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          }
        },
        {
          host: 'logStream',
          source: 'nginx-forward-proxy',
          sourcetype: 'nginx:plus:kv',
          index: 'pay_ingress',
          event: 'Log event message 2',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          }
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const anNginxReverseProxyCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'test-12_nginx-reverse-proxy_frontend',
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
      })).toString('base64')
    }]
  },
  expected: {
    records: [{
      result: 'Ok',
      recordId: 'LogEvent-1',
      data: Buffer.from([
        {
          host: 'logStream',
          source: 'nginx-reverse-proxy',
          sourcetype: 'nginx:plus:kv',
          index: 'pay_ingress',
          event: 'Log event message 1',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          }
        },
        {
          host: 'logStream',
          source: 'nginx-reverse-proxy',
          sourcetype: 'nginx:plus:kv',
          index: 'pay_ingress',
          event: 'Log event message 2',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          }
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}
