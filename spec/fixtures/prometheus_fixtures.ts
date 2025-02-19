import { Fixture } from './general_fixtures'

export const aPrometheusSyslogCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'pay-cd-prometheus_syslog_prometheus',
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
            service: 'prometheus'
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
            service: 'prometheus'
          },
          time: 1739182596.000
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const aPrometheusAuditCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'pay-cd-prometheus_audit_prometheus',
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
            service: 'prometheus'
          },
          time: 1739184096.304
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const aPrometheusAuthCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'pay-cd-prometheus_auth_prometheus',
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
            service: 'prometheus'
          },
          time: 1739157038.000
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const aPrometheusKernCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'pay-cd-prometheus_kern_prometheus',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: '1234',
            message: 'Feb 10 10:59:50 ip-10-1-10-215 kernel: [28395.086087] prometheus0: port 25(veth2d1be85e) entered blocking state'
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
          event: 'Feb 10 10:59:50 ip-10-1-10-215 kernel: [28395.086087] prometheus0: port 25(veth2d1be85e) entered blocking state',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'prometheus'
          },
          time: 1739185190.000
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const aPrometheusDmesgCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'pay-cd-prometheus_dmesg_prometheus',
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
            service: 'prometheus'
          }
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const aPrometheusAptCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'pay-cd-prometheus_apt_prometheus',
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
            service: 'prometheus'
          }
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}
