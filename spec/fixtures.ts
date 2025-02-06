import { FirehoseTransformationEvent, FirehoseTransformationResult } from "aws-lambda";

type Fixture = {
  input: FirehoseTransformationEvent
  expected: FirehoseTransformationResult
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
        owner: "223851549868",
        logGroup: "test-12_app_frontend",
        logStream: "frontendECSTaskId",
        subscriptionFilters: [],
        messageType: "DATA_MESSAGE",
        logEvents: [
          {
            id: "cloudwatch-log-message-id-1",
            timestamp: "1234",
            message: "Log event message 1"
          },
          {
            id: "cloudwatch-log-gmessage-id-2",
            timestamp: "12345",
            message: "Log event message 2"
          }
        ]
      })).toString('base64')
    },
    {
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-2',
      data: Buffer.from(JSON.stringify({
        owner: "223851549868",
        logGroup: "test-12_app_connector",
        logStream: "connectorECSTaskId",
        subscriptionFilters: [],
        messageType: "DATA_MESSAGE",
        logEvents: [
          {
            id: "cloudwatch-log-message-id-1",
            timestamp: "1234",
            message: "Log event message 1"
          },
          {
            id: "cloudwatch-log-gmessage-id-2",
            timestamp: "12345",
            message: "Log event message 2"
          }
        ]
      })).toString('base64')
    },
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
      ].map((x) => JSON.stringify(x)).join('\n')).toString('base64')
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
      ].map((x) => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const anNginxForwardProxyCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: "223851549868",
        logGroup: "test-12_nginx-forward-proxy_frontend",
        logStream: "logStream",
        subscriptionFilters: [],
        messageType: "DATA_MESSAGE",
        logEvents: [
          {
            id: "cloudwatch-log-message-id-1",
            timestamp: "1234",
            message: "Log event message 1"
          },
          {
            id: "cloudwatch-log-gmessage-id-2",
            timestamp: "12345",
            message: "Log event message 2"
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
      ].map((x) => JSON.stringify(x)).join('\n')).toString('base64')
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
        owner: "223851549868",
        logGroup: "test-12_nginx-reverse-proxy_frontend",
        logStream: "logStream",
        subscriptionFilters: [],
        messageType: "DATA_MESSAGE",
        logEvents: [
          {
            id: "cloudwatch-log-message-id-1",
            timestamp: "1234",
            message: "Log event message 1"
          },
          {
            id: "cloudwatch-log-gmessage-id-2",
            timestamp: "12345",
            message: "Log event message 2"
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
      ].map((x) => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

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
            S3Key: 'some-source-key',
          },
          ALB: 'test-12-connector-alb',
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
          host: 'test-12-connector-alb',
          source: 'ALB',
          sourcetype: 'aws:elb:accesslogs',
          index: 'pay_ingress',
          event: 'alb log line 1',
          fields: {
            account: 'test',
            environment: 'test-12'
          }
        }, {
          host: 'test-12-connector-alb',
          source: 'ALB',
          sourcetype: 'aws:elb:accesslogs',
          index: 'pay_ingress',
          event: 'alb log line 2',
          fields: {
            account: 'test',
            environment: 'test-12'
          }
        }
      ].map((x) => JSON.stringify(x)).join('\n')).toString('base64')
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
            S3Key: 'some-source-key',
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
          index: 'pay_access',
          event: 'log line 1',
          fields: {
            account: 'test',
            environment: 'test-12'
          }
        }, {
          host: 'the-actual-bucket',
          source: 'S3',
          sourcetype: 'aws:s3:accesslogs',
          index: 'pay_access',
          event: 'log line 2',
          fields: {
            account: 'test',
            environment: 'test-12'
          }
        }
      ].map((x) => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export function aCloudWatchEventWith(overrides: object[]): FirehoseTransformationEvent {
  const defaultValues = {
    owner: "223851549868",
    logGroup: "test-12_type_service",
    logStream: "logStream",
    subscriptionFilters: [],
    messageType: "DATA_MESSAGE",
    logEvents: [
      {
        id: "cloudwatch-log-message-id-1",
        timestamp: "1234",
        message: "Log event message 1"
      },
      {
        id: "cloudwatch-log-gmessage-id-2",
        timestamp: "12345",
        message: "Log event message 2"
      }
    ]
  }

  return {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: overrides.map((value, index) => {
      return {
        approximateArrivalTimestamp: 1234,
        recordId: `LogEvent-${index + 1}`,
        data: Buffer.from(JSON.stringify(
          {
            ...defaultValues,
            ...value
          })
        ).toString('base64')
      }
    })
  }
}

