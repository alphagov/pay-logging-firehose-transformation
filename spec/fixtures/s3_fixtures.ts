import { Fixture } from './general_fixtures'

export const anS3AlbEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1740578973,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify(
        {
          SourceFile: {
            S3Bucket: 'some-source-bucket',
            S3Key: 'some-source-key'
          },
          ALB: 'test-12-products-ui-alb',
          AWSAccountID: '223851549868',
          AWSAccountName: 'pay-test',
          Logs: [
            'log-1 should use approximateArrivalTimestamp',
            'log-2 should use time 2025-02-26T14:05:00.801440Z ',
            'log-3 should use time from log-2'
          ]
        }
      )).toString('base64')
    }]
  },
  expected: {
    records: [{
      result: 'Ok',
      recordId: 'LogEvent-1',
      data: Buffer.from([
        {
          host: 'test-12-products-ui-alb',
          source: 'ALB',
          sourcetype: 'aws:elb:accesslogs',
          index: 'pay_ingress',
          event: 'log-1 should use approximateArrivalTimestamp',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'products-ui'
          },
          time: 1740578973
        }, {
          host: 'test-12-products-ui-alb',
          source: 'ALB',
          sourcetype: 'aws:elb:accesslogs',
          index: 'pay_ingress',
          event: 'log-2 should use time 2025-02-26T14:05:00.801440Z ',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'products-ui'
          },
          time: 1740578700.801
        }, {
          host: 'test-12-products-ui-alb',
          source: 'ALB',
          sourcetype: 'aws:elb:accesslogs',
          index: 'pay_ingress',
          event: 'log-3 should use time from log-2',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'products-ui'
          },
          time: 1740578700.801
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const anS3AlbPactbrokerEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify(
        {
          SourceFile: {
            S3Bucket: 'some-source-bucket',
            S3Key: 'some-source-key'
          },
          ALB: 'test-12-tooling-pactbroker-alb',
          AWSAccountID: '223851549868',
          AWSAccountName: 'pay-test',
          Logs: ['alb log line 1 2025-02-26T14:05:00.801440Z', 'alb log line 2 2025-02-26T14:05:10.801440Z']
        }
      )).toString('base64')
    }]
  },
  expected: {
    records: [{
      result: 'Ok',
      recordId: 'LogEvent-1',
      data: Buffer.from([
        {
          host: 'test-12-tooling-pactbroker-alb',
          source: 'ALB',
          sourcetype: 'aws:elb:accesslogs',
          index: 'pay_ingress',
          event: 'alb log line 1 2025-02-26T14:05:00.801440Z',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'pactbroker'
          },
          time: 1740578700.801
        }, {
          host: 'test-12-tooling-pactbroker-alb',
          source: 'ALB',
          sourcetype: 'aws:elb:accesslogs',
          index: 'pay_ingress',
          event: 'alb log line 2 2025-02-26T14:05:10.801440Z',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'pactbroker'
          },
          time: 1740578710.801
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const anS3AccessEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1741165880,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify(
        {
          SourceFile: {
            S3Bucket: 'some-source-bucket',
            S3Key: 'some-source-key'
          },
          S3Bucket: 'the-actual-bucket',
          AWSAccountID: '223851549868',
          AWSAccountName: 'pay-test',
          Logs: [
            'no time so use approximateArrivalTimestamp',
            '79a59df900b949e55d96a1e698fbacedfd6e09d98eacf8f8d5218e7cd47ef2be amzn-s3-demo-bucket1 [06/Feb/2019:00:01:00 +0000] 192.0.2.3 79a59df900b949e55d96a1e698fbacedfd6e09d98eacf8f8d5218e7cd47ef2be 7B4A0FABBEXAMPLE REST.GET.VERSIONING - "GET /amzn-s3-demo-bucket1?versioning HTTP/1.1" 200 - 113 - 33 - "-" "S3Console/0.4" - Ke1bUcazaN1jWuUlPJaxF64cQVpUEhoZKEG/hmy/gijN/I1DeWqDfFvnpybfEseEME/u7ME1234= SigV4 ECDHE-RSA-AES128-GCM-SHA256 AuthHeader amzn-s3-demo-bucket1.s3.us-west-1.amazonaws.com TLSV1.2 - -',
            'no time so use previous log line time'
          ]
        }
      )).toString('base64')
    }]
  },
  expected: {
    records: [{
      result: 'Ok',
      recordId: 'LogEvent-1',
      data: Buffer.from([
        {
          host: 'the-actual-bucket',
          source: 'S3',
          sourcetype: 'aws:s3:accesslogs',
          index: 'pay_storage',
          event: 'no time so use approximateArrivalTimestamp',
          fields: {
            account: 'test',
            environment: 'test-12'
          },
          time: 1741165880.000
        }, {
          host: 'the-actual-bucket',
          source: 'S3',
          sourcetype: 'aws:s3:accesslogs',
          index: 'pay_storage',
          event: '79a59df900b949e55d96a1e698fbacedfd6e09d98eacf8f8d5218e7cd47ef2be amzn-s3-demo-bucket1 [06/Feb/2019:00:01:00 +0000] 192.0.2.3 79a59df900b949e55d96a1e698fbacedfd6e09d98eacf8f8d5218e7cd47ef2be 7B4A0FABBEXAMPLE REST.GET.VERSIONING - "GET /amzn-s3-demo-bucket1?versioning HTTP/1.1" 200 - 113 - 33 - "-" "S3Console/0.4" - Ke1bUcazaN1jWuUlPJaxF64cQVpUEhoZKEG/hmy/gijN/I1DeWqDfFvnpybfEseEME/u7ME1234= SigV4 ECDHE-RSA-AES128-GCM-SHA256 AuthHeader amzn-s3-demo-bucket1.s3.us-west-1.amazonaws.com TLSV1.2 - -',
          fields: {
            account: 'test',
            environment: 'test-12'
          },
          time: 1549411260.000
        }, {
          host: 'the-actual-bucket',
          source: 'S3',
          sourcetype: 'aws:s3:accesslogs',
          index: 'pay_storage',
          event: 'no time so use previous log line time',
          fields: {
            account: 'test',
            environment: 'test-12'
          },
          time: 1549411260.000
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}
