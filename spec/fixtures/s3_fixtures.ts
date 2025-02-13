import { Fixture } from './general_fixtures'

export const anS3AlbEvent: Fixture = {
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
          ALB: 'test-12-products-ui-alb',
          AWSAccountID: '223851549868',
          AWSAccountName: 'pay-test',
          Logs: ['alb log line 1', 'alb log line 2']
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
          event: 'alb log line 1',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'products-ui'
          }
        }, {
          host: 'test-12-products-ui-alb',
          source: 'ALB',
          sourcetype: 'aws:elb:accesslogs',
          index: 'pay_ingress',
          event: 'alb log line 2',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'products-ui'
          }
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
          Logs: ['alb log line 1', 'alb log line 2']
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
          event: 'alb log line 1',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'pactbroker'
          }
        }, {
          host: 'test-12-tooling-pactbroker-alb',
          source: 'ALB',
          sourcetype: 'aws:elb:accesslogs',
          index: 'pay_ingress',
          event: 'alb log line 2',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'pactbroker'
          }
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
      approximateArrivalTimestamp: 1234,
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
          Logs: ['log line 1', 'log line 2']
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
          event: 'log line 1',
          fields: {
            account: 'test',
            environment: 'test-12'
          }
        }, {
          host: 'the-actual-bucket',
          source: 'S3',
          sourcetype: 'aws:s3:accesslogs',
          index: 'pay_storage',
          event: 'log line 2',
          fields: {
            account: 'test',
            environment: 'test-12'
          }
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}
