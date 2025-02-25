import { Fixture } from './general_fixtures'

export const aMultiLogVpcFlowLogCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'mixed-protocol-event',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'test-12_vpc-flow-logs',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: 1740495533,
            message: '2 223851549868 eni-0eda3cf860c2573f2 172.18.96.226 172.18.2.133 34238 443 6 17 5466 1739358222 1739358234 ACCEPT OK' // <-- filtered because it is TCP
          },
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: 1740495533,
            message: '2 223851549868 eni-0eda3cf860c2573f2 172.18.96.226 172.18.2.133 34238 443 1 17 5466 1739358222 1739358234 ACCEPT OK' // <-- filtered because it is ICMP
          },
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: 1740495533,
            message: '2 223851549868 eni-0eda3cf860c2573f2 172.18.96.226 172.18.2.133 34238 443 17 17 5466 1739358222 1739358234 ACCEPT OK' // <-- filtered because it is UDP
          },
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: 1740495533,
            message: '2 223851549868 eni-0eda3cf860c2573f2 172.18.96.226 172.18.2.133 34238 443 2 17 5466 1739358222 1739358234 REJECT OK' // <-- filtered because it is REJECT
          },
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: 1740495533,
            message: '2 223851549868 eni-0eda3cf860c2573f2 172.18.96.226 172.18.2.133 34238 443 2 17 5466 1739358222 1739358234 ACCEPT OK' // <-- This should go to Splunk
          }
        ]
      })).toString('base64')
    }]
  },
  expected: {
    records: [{
      result: 'Ok',
      recordId: 'mixed-protocol-event',
      data: Buffer.from([
        {
          host: 'logStream',
          source: 'vpc-flow-logs',
          sourcetype: 'aws:cloudwatchlogs:vpcflow',
          index: 'pay_platform',
          event: '2 223851549868 eni-0eda3cf860c2573f2 172.18.96.226 172.18.2.133 34238 443 2 17 5466 1739358222 1739358234 ACCEPT OK',
          fields: {
            account: 'test',
            environment: 'test-12'
          },
          time: 1740495533
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const aMultiLogVpcFlowLogAllFilteredCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'some-id',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'record-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'test-12_vpc-flow-logs',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: '1234',
            message: '2 223851549868 eni-0eda3cf860c2573f2 172.18.96.226 172.18.2.133 34238 443 6 17 5466 1739358222 1739358234 ACCEPT OK' // <-- filtered because it is TCP

          },
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: '1234',
            message: '2 223851549868 eni-0eda3cf860c2573f2 172.18.96.226 172.18.2.133 34238 443 1 17 5466 1739358222 1739358234 ACCEPT OK' // <-- filtered because it is ICMP

          },
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: '1234',
            message: '2 223851549868 eni-0eda3cf860c2573f2 172.18.96.226 172.18.2.133 34238 443 17 17 5466 1739358222 1739358234 ACCEPT OK' // <-- filtered because it is UDP

          }
        ]
      })).toString('base64')
    }]
  },
  expected: {
    records: [{
      result: 'Dropped',
      recordId: 'record-1',
      data: Buffer.from('').toString('base64')
    }]
  }
}
