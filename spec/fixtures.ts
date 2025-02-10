import { Callback, Context, FirehoseTransformationEventRecord, FirehoseTransformationEvent, FirehoseTransformationResult } from 'aws-lambda'

type Fixture = {
  input: FirehoseTransformationEvent
  expected: FirehoseTransformationResult
}

export const mockCallback: Callback = () => undefined

export const mockContext: Context = {
  awsRequestId: '246fc613-8e0d-482a-9df5-158f2add0665',
  callbackWaitsForEmptyEventLoop: true,
  done: () => console.log('Complete'),
  fail: () => console.log('Error'),
  functionName: 'firehoseTransform',
  functionVersion: '$LATEST',
  getRemainingTimeInMillis: () => 333,
  invokedFunctionArn: 'arn:aws:lambda:eu-west-2:987654321:function:firehoseTransform',
  logGroupName: '/aws/lambda/firehoseTransform',
  logStreamName: '2025/02/06/[$LATEST]123456',
  memoryLimitInMB: '256',
  succeed: () => console.log('Great Success')
}

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

export const aConcourseSyslogCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'pay-cd-concourse_syslog_concourse',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: '1234',
            message: 'Feb 10 10:16:36 ip-10-1-10-72 check-available-memory[2996]: Calculated memory available: 72.6612%'
          },
          {
            id: 'cloudwatch-log-gmessage-id-2',
            timestamp: '12345',
            message: 'Feb 10 10:16:36 ip-10-1-10-72 systemd[1]: check-available-memory.service: Deactivated successfully.'
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
          source: 'syslog',
          sourcetype: 'linux_messages_syslog',
          index: 'pay_devops',
          event: 'Feb 10 10:16:36 ip-10-1-10-72 check-available-memory[2996]: Calculated memory available: 72.6612%',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'concourse'
          }
        },
        {
          host: 'logStream',
          source: 'syslog',
          sourcetype: 'linux_messages_syslog',
          index: 'pay_devops',
          event: 'Feb 10 10:16:36 ip-10-1-10-72 systemd[1]: check-available-memory.service: Deactivated successfully.',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'concourse'
          }
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const aConcourseAuditCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'pay-cd-concourse_audit_concourse',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: '1234',
            message: 'type=SERVICE_STOP msg=audit(1739184096.304:468): pid=1 uid=0 auid=4294967295 ses=4294967295 subj=unconfined msg=\'unit=check-available-memory comm="systemd" exe="/usr/lib/systemd/systemd" hostname=? addr=? terminal=? res=success\''
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
          source: 'audit',
          sourcetype: 'linux_audit',
          index: 'pay_devops',
          event: 'type=SERVICE_STOP msg=audit(1739184096.304:468): pid=1 uid=0 auid=4294967295 ses=4294967295 subj=unconfined msg=\'unit=check-available-memory comm="systemd" exe="/usr/lib/systemd/systemd" hostname=? addr=? terminal=? res=success\'',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'concourse'
          }
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const aConcourseAuthCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'pay-cd-concourse_auth_concourse',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: '1234',
            message: 'Feb 10 03:10:38 ip-10-1-11-65 sshd[635]: Server listening on :: port 22.'
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
          source: 'auth',
          sourcetype: 'linux_secure',
          index: 'pay_devops',
          event: 'Feb 10 03:10:38 ip-10-1-11-65 sshd[635]: Server listening on :: port 22.',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'concourse'
          }
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const aConcourseKernCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'pay-cd-concourse_kern_concourse',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: '1234',
            message: 'Feb 10 10:59:50 ip-10-1-10-215 kernel: [28395.086087] concourse0: port 25(veth2d1be85e) entered blocking state'
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
          source: 'kern',
          sourcetype: 'linux_messages_syslog',
          index: 'pay_devops',
          event: 'Feb 10 10:59:50 ip-10-1-10-215 kernel: [28395.086087] concourse0: port 25(veth2d1be85e) entered blocking state',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'concourse'
          }
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const aConcourseDmesgCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'pay-cd-concourse_dmesg_concourse',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: '1234',
            message: '[    9.105692] kernel: Btrfs loaded, zoned=yes, fsverity=yes'
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
          source: 'dmesg',
          sourcetype: 'dmesg',
          index: 'pay_devops',
          event: '[    9.105692] kernel: Btrfs loaded, zoned=yes, fsverity=yes',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'concourse'
          }
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const aConcourseAptCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'pay-cd-concourse_apt_concourse',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: '1234',
            message: 'Commandline: apt-get install --yes auditd'
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
          source: 'apt',
          sourcetype: 'generic_single_line',
          index: 'pay_devops',
          event: 'Commandline: apt-get install --yes auditd',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'concourse'
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

export function aCloudWatchEventWith(overrides: object[]): FirehoseTransformationEvent {
  const defaultValues = {
    owner: '223851549868',
    logGroup: 'test-12_type_service',
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
