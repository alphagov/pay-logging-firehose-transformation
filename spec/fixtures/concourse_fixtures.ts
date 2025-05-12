import { Fixture } from './general_fixtures'

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
          },
          time: 1739182596.000
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
          },
          time: 1739182596.000
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
          },
          time: 1739184096.304
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
          },
          time: 1739157038.000
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
          },
          time: 1739185190.000
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
            timestamp: 1740495826,
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
          },
          time: 1740495826
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
            timestamp: 1740495811,
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
          },
          time: 1740495811
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const aConcourseApplicationCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'pay-cd-concourse_concourse_concourse',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: '1234',
            message: '{"timestamp":"2025-02-10T11:50:15.965132255Z","level":"info","source":"baggageclaim","message":"baggageclaim.api.volume-server.destroy.destroy-volume.destroyed","data":{"session":"4.1.49535.1","volume":"4da70dbf-66de-4f75-76b0-654e2fa32268"}}'
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
          source: 'concourse',
          sourcetype: 'ST004:concourse',
          index: 'pay_devops',
          event: '{"timestamp":"2025-02-10T11:50:15.965132255Z","level":"info","source":"baggageclaim","message":"baggageclaim.api.volume-server.destroy.destroy-volume.destroyed","data":{"session":"4.1.49535.1","volume":"4da70dbf-66de-4f75-76b0-654e2fa32268"}}',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'concourse'
          },
          time: 1739188215.965
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const aGrafanaEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'pay-cd-concourse_grafana_grafana',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: 1740495811,
            message: 'logger=cleanup t=2025-05-12T08:11:56.956036426Z level=info msg="Completed cleanup jobs" duration=9.675842ms'
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
          source: 'grafana',
          sourcetype: 'generic_single_line',
          index: 'pay_devops',
          event: 'logger=cleanup t=2025-05-12T08:11:56.956036426Z level=info msg="Completed cleanup jobs" duration=9.675842ms',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'grafana'
          },
          time: 1747037516.956
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}
