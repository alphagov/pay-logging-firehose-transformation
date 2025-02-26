import { Fixture } from './general_fixtures'

export const aSquidEgressAccessLogCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'test-12_squid_egress',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: '1234',
            message: '1739285977.555   6074 172.18.4.240 TCP_TUNNEL/200 7095 CONNECT logs.eu-west-1.amazonaws.com:443 - HIER_DIRECT/172.18.2.195 -'
          },
          {
            id: 'cloudwatch-log-gmessage-id-2',
            timestamp: '12345',
            message: '1739285977.093   6099 172.18.4.240 TCP_TUNNEL/200 7095 CONNECT logs.eu-west-1.amazonaws.com:443 - HIER_DIRECT/172.18.2.195 -'
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
          source: 'squid',
          sourcetype: 'squid:access',
          index: 'pay_egress',
          event: '1739285977.555   6074 172.18.4.240 TCP_TUNNEL/200 7095 CONNECT logs.eu-west-1.amazonaws.com:443 - HIER_DIRECT/172.18.2.195 -',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'egress'
          },
          time: 1739285977.555
        },
        {
          host: 'logStream',
          source: 'squid',
          sourcetype: 'squid:access',
          index: 'pay_egress',
          event: '1739285977.093   6099 172.18.4.240 TCP_TUNNEL/200 7095 CONNECT logs.eu-west-1.amazonaws.com:443 - HIER_DIRECT/172.18.2.195 -',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'egress'
          },
          time: 1739285977.093
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const aSquidEgressCacheLogCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'test-12_squid_egress',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: 1740495625,
            message: '2025/02/10 16:52:36| Preparing for shutdown after 61285 requests'
          },
          {
            id: 'cloudwatch-log-gmessage-id-2',
            timestamp: 1740495626,
            message: '2025/02/10 16:52:35| Waiting 30 seconds for active connections to finish'
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
          source: 'squid',
          sourcetype: 'ST004:squid:cache',
          index: 'pay_egress',
          event: '2025/02/10 16:52:36| Preparing for shutdown after 61285 requests',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'egress'
          },
          time: 1739206356.000
        },
        {
          host: 'logStream',
          source: 'squid',
          sourcetype: 'ST004:squid:cache',
          index: 'pay_egress',
          event: '2025/02/10 16:52:35| Waiting 30 seconds for active connections to finish',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'egress'
          },
          time: 1739206355.000
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const aSquidWebhookEgressCacheLogCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'test-12_squid_webhook-egress',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: 1740495581,
            message: '    listening port: 0.0.0.0:8080'
          },
          {
            id: 'cloudwatch-log-gmessage-id-2',
            timestamp: 1740495582,
            message: '2025/02/10 16:52:36| Closing HTTP(S) port 0.0.0.0:8080'
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
          source: 'squid',
          sourcetype: 'ST004:squid:cache',
          index: 'pay_egress',
          event: '    listening port: 0.0.0.0:8080',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'webhook-egress'
          },
          time: 1740495581
        },
        {
          host: 'logStream',
          source: 'squid',
          sourcetype: 'ST004:squid:cache',
          index: 'pay_egress',
          event: '2025/02/10 16:52:36| Closing HTTP(S) port 0.0.0.0:8080',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'webhook-egress'
          },
          time: 1739206356.000
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const aSquidWebhookEgressAccessLogCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'test-12_squid_webhook-egress',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: 1740495625,
            message: '1739285977.555   6074 172.18.4.240 TCP_TUNNEL/200 7095 CONNECT logs.eu-west-1.amazonaws.com:443 - HIER_DIRECT/172.18.2.195 -'
          },
          {
            id: 'cloudwatch-log-gmessage-id-2',
            timestamp: 1740495626,
            message: '1739285977.093   6099 172.18.4.240 TCP_TUNNEL/200 7095 CONNECT logs.eu-west-1.amazonaws.com:443 - HIER_DIRECT/172.18.2.195 -'
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
          source: 'squid',
          sourcetype: 'squid:access',
          index: 'pay_egress',
          event: '1739285977.555   6074 172.18.4.240 TCP_TUNNEL/200 7095 CONNECT logs.eu-west-1.amazonaws.com:443 - HIER_DIRECT/172.18.2.195 -',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'webhook-egress'
          },
          time: 1739285977.555
        },
        {
          host: 'logStream',
          source: 'squid',
          sourcetype: 'squid:access',
          index: 'pay_egress',
          event: '1739285977.093   6099 172.18.4.240 TCP_TUNNEL/200 7095 CONNECT logs.eu-west-1.amazonaws.com:443 - HIER_DIRECT/172.18.2.195 -',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'webhook-egress'
          },
          time: 1739285977.093
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}
