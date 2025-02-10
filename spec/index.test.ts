import { FirehoseTransformationResult } from 'aws-lambda'
import { handler } from '../src/index'

import {
  anApplicationLogCloudWatchEvent,
  anInvalidApplicationLogFirehoseTransformationEventRecord
} from './fixtures/application_fixtures'

import {
  aConcourseSyslogCloudWatchEvent,
  aConcourseAuditCloudWatchEvent,
  aConcourseAuthCloudWatchEvent,
  aConcourseKernCloudWatchEvent,
  aConcourseDmesgCloudWatchEvent,
  aConcourseAptCloudWatchEvent,
  aConcourseApplicationCloudWatchEvent
} from './fixtures/concourse_fixtures'

import {
  aPrometheusSyslogCloudWatchEvent,
  aPrometheusAuditCloudWatchEvent,
  aPrometheusAuthCloudWatchEvent,
  aPrometheusKernCloudWatchEvent,
  aPrometheusDmesgCloudWatchEvent,
  aPrometheusAptCloudWatchEvent
} from './fixtures/prometheus_fixtures'

import {
  anS3AlbEvent,
  anS3AccessEvent
} from './fixtures/s3_fixtures'

import {
  anNginxForwardProxyCloudWatchEvent,
  anNginxReverseProxyCloudWatchEvent
} from './fixtures/nginx_fixtures'

import {
  aCloudWatchEventWith,
  mockCallback,
  mockContext
} from './fixtures/general_fixtures'

process.env.ENVIRONMENT = 'test-12'
process.env.ACCOUNT = 'test'

describe('Processing CloudWatchLogEvents', () => {
  describe('From Applications', () => {
    test('should transform application logs from CloudWatch', async () => {
      const result = await handler(anApplicationLogCloudWatchEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

      const expectedFirstRecord = anApplicationLogCloudWatchEvent.expected.records[0]
      expect(result.records[0].result).toEqual(expectedFirstRecord.result)
      expect(result.records[0].recordId).toEqual(expectedFirstRecord.recordId)
      expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expectedFirstRecord.data as string, 'base64').toString())

      const expectedSecondRecord = anApplicationLogCloudWatchEvent.expected.records[1]
      expect(result.records[1].result).toEqual('Ok')
      expect(result.records[1].recordId).toEqual('LogEvent-2')
      expect(Buffer.from(result.records[1].data as string, 'base64').toString()).toEqual(Buffer.from(expectedSecondRecord.data as string, 'base64').toString())
    })
  })

  describe('From Nginx', () => {
    test('should transform nginx forward proxy logs from CloudWatch', async () => {
      const result = await handler(anNginxForwardProxyCloudWatchEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

      const expected = anNginxForwardProxyCloudWatchEvent.expected.records[0]
      expect(result.records[0].result).toEqual(expected.result)
      expect(result.records[0].recordId).toEqual(expected.recordId)
      expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
    })

    test('should transform nginx reverse proxy logs from CloudWatch', async () => {
      const result = await handler(anNginxReverseProxyCloudWatchEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

      const expected = anNginxReverseProxyCloudWatchEvent.expected.records[0]
      expect(result.records[0].result).toEqual(expected.result)
      expect(result.records[0].recordId).toEqual(expected.recordId)
      expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
    })
  })

  describe('From Concourse', () => {
    test('should transform concourse syslog logs from CloudWatch', async () => {
      const result = await handler(aConcourseSyslogCloudWatchEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

      const expected = aConcourseSyslogCloudWatchEvent.expected.records[0]
      expect(result.records[0].result).toEqual(expected.result)
      expect(result.records[0].recordId).toEqual(expected.recordId)
      expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
    })

    test('should transform concourse audit logs from CloudWatch', async () => {
      const result = await handler(aConcourseAuditCloudWatchEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

      const expected = aConcourseAuditCloudWatchEvent.expected.records[0]
      expect(result.records[0].result).toEqual(expected.result)
      expect(result.records[0].recordId).toEqual(expected.recordId)
      expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
    })

    test('should transform concourse auth logs from CloudWatch', async () => {
      const result = await handler(aConcourseAuthCloudWatchEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

      const expected = aConcourseAuthCloudWatchEvent.expected.records[0]
      expect(result.records[0].result).toEqual(expected.result)
      expect(result.records[0].recordId).toEqual(expected.recordId)
      expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
    })

    test('should transform concourse kern logs from CloudWatch', async () => {
      const result = await handler(aConcourseKernCloudWatchEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

      const expected = aConcourseKernCloudWatchEvent.expected.records[0]
      expect(result.records[0].result).toEqual(expected.result)
      expect(result.records[0].recordId).toEqual(expected.recordId)
      expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
    })

    test('should transform concourse dmesg logs from CloudWatch', async () => {
      const result = await handler(aConcourseDmesgCloudWatchEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

      const expected = aConcourseDmesgCloudWatchEvent.expected.records[0]
      expect(result.records[0].result).toEqual(expected.result)
      expect(result.records[0].recordId).toEqual(expected.recordId)
      expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
    })

    test('should transform concourse apt logs from CloudWatch', async () => {
      const result = await handler(aConcourseAptCloudWatchEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

      const expected = aConcourseAptCloudWatchEvent.expected.records[0]
      expect(result.records[0].result).toEqual(expected.result)
      expect(result.records[0].recordId).toEqual(expected.recordId)
      expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
    })

    test('should transform concourse application logs from CloudWatch', async () => {
      const result = await handler(aConcourseApplicationCloudWatchEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

      const expected = aConcourseApplicationCloudWatchEvent.expected.records[0]
      expect(result.records[0].result).toEqual(expected.result)
      expect(result.records[0].recordId).toEqual(expected.recordId)
      expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
    })
  })

  describe('From Prometheus', () => {
    test('should transform prometheus syslog logs from CloudWatch', async () => {
      const result = await handler(aPrometheusSyslogCloudWatchEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

      const expected = aPrometheusSyslogCloudWatchEvent.expected.records[0]
      expect(result.records[0].result).toEqual(expected.result)
      expect(result.records[0].recordId).toEqual(expected.recordId)
      expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
    })

    test('should transform prometheus audit logs from CloudWatch', async () => {
      const result = await handler(aPrometheusAuditCloudWatchEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

      const expected = aPrometheusAuditCloudWatchEvent.expected.records[0]
      expect(result.records[0].result).toEqual(expected.result)
      expect(result.records[0].recordId).toEqual(expected.recordId)
      expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
    })

    test('should transform prometheus auth logs from CloudWatch', async () => {
      const result = await handler(aPrometheusAuthCloudWatchEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

      const expected = aPrometheusAuthCloudWatchEvent.expected.records[0]
      expect(result.records[0].result).toEqual(expected.result)
      expect(result.records[0].recordId).toEqual(expected.recordId)
      expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
    })

    test('should transform prometheus kern logs from CloudWatch', async () => {
      const result = await handler(aPrometheusKernCloudWatchEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

      const expected = aPrometheusKernCloudWatchEvent.expected.records[0]
      expect(result.records[0].result).toEqual(expected.result)
      expect(result.records[0].recordId).toEqual(expected.recordId)
      expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
    })

    test('should transform prometheus dmesg logs from CloudWatch', async () => {
      const result = await handler(aPrometheusDmesgCloudWatchEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

      const expected = aPrometheusDmesgCloudWatchEvent.expected.records[0]
      expect(result.records[0].result).toEqual(expected.result)
      expect(result.records[0].recordId).toEqual(expected.recordId)
      expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
    })

    test('should transform prometheus apt logs from CloudWatch', async () => {
      const result = await handler(aPrometheusAptCloudWatchEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

      const expected = aPrometheusAptCloudWatchEvent.expected.records[0]
      expect(result.records[0].result).toEqual(expected.result)
      expect(result.records[0].recordId).toEqual(expected.recordId)
      expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
    })
  })

  test('should drop CloudWatch logs which are not DATA_MESSAGE', async () => {
    const result = await handler(aCloudWatchEventWith([{ messageType: 'CONTROL' }]), mockContext, mockCallback) as FirehoseTransformationResult
    expect(result.records[0].result).toEqual('Dropped')
  })

  test('should error for unknown log type', async () => {
    const result = await handler(aCloudWatchEventWith([{ logGroup: 'test-12_UNKNOWN_app' }]), mockContext, mockCallback) as FirehoseTransformationResult
    expect(result.records[0].result).toEqual('ProcessingFailed')
    expect(result.records[0].recordId).toEqual('LogEvent-1')
  })

  test('should error for invalid log group format', async () => {
    const result = await handler(aCloudWatchEventWith([{ logGroup: 'invalid' }]), mockContext, mockCallback) as FirehoseTransformationResult
    expect(result.records[0].result).toEqual('ProcessingFailed')
    expect(result.records[0].recordId).toEqual('LogEvent-1')
  })
})

describe('Processing S3 Logs', () => {
  test('should transform ALB log from S3', async () => {
    // noinspection TypeScriptValidateTypes
    const result = await handler(anS3AlbEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

    const expected = anS3AlbEvent.expected.records[0]
    expect(result.records[0].result).toEqual(expected.result)
    expect(result.records[0].recordId).toEqual(expected.recordId)
    expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
  })

  test('should transform S3 access from S3', async () => {
    const result = await handler(anS3AccessEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

    const expected = anS3AccessEvent.expected.records[0]
    expect(result.records[0].result).toEqual(expected.result)
    expect(result.records[0].recordId).toEqual(expected.recordId)
    expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expected.data as string, 'base64').toString())
  })
})

describe('General processing', () => {
  test('when one bad record fails transformation other good records still succeed', async () => {
    const event = anApplicationLogCloudWatchEvent.input

    event.records = [
      event.records[0],
      anInvalidApplicationLogFirehoseTransformationEventRecord,
      event.records[1]
    ]

    const result = await handler(event, mockContext, mockCallback) as FirehoseTransformationResult

    const expectedFirstRecord = anApplicationLogCloudWatchEvent.expected.records[0]
    expect(result.records[0].result).toEqual(expectedFirstRecord.result)
    expect(result.records[0].recordId).toEqual(expectedFirstRecord.recordId)
    expect(Buffer.from(result.records[0].data as string, 'base64').toString()).toEqual(Buffer.from(expectedFirstRecord.data as string, 'base64').toString())

    expect(result.records[1].result).toEqual('ProcessingFailed')
    expect(result.records[1].recordId).toEqual(anInvalidApplicationLogFirehoseTransformationEventRecord.recordId)

    const expectedThirdRecord = anApplicationLogCloudWatchEvent.expected.records[1]
    expect(result.records[2].result).toEqual('Ok')
    expect(result.records[2].recordId).toEqual('LogEvent-2')
    expect(Buffer.from(result.records[2].data as string, 'base64').toString()).toEqual(Buffer.from(expectedThirdRecord.data as string, 'base64').toString())
  })

  test('should error if event data is unknown format', async () => {
    const event = aCloudWatchEventWith([{ recordId: 'testRecordId', unknown: 'invalid' }])
    event.records = [
      {
        approximateArrivalTimestamp: 9876,
        recordId: 'testRecordId',
        data: Buffer.from(JSON.stringify({ unknown: 'invalid' })).toString('base64')
      }
    ]
    const result = await handler(event, mockContext, mockCallback) as FirehoseTransformationResult
    expect(result.records[0].result).toEqual('ProcessingFailed')
    expect(result.records[0].recordId).toEqual('testRecordId')
  })

  test('should error if ENVIRONMENT env var is not set', async () => {
    process.env.ACCOUNT = 'test'
    process.env.ENVIRONMENT = ''
    await expect(async () => await handler(aCloudWatchEventWith([]), mockContext, mockCallback) as FirehoseTransformationResult).rejects.toThrow('"ENVIRONMENT" env var is not set')
  })

  test('should error if ACCOUNT env var is not set', async () => {
    process.env.ENVIRONMENT = 'test-12'
    process.env.ACCOUNT = ''
    await expect(async () => await handler(aCloudWatchEventWith([]), mockContext, mockCallback) as FirehoseTransformationResult).rejects.toThrow('"ACCOUNT" env var is not set')
  })
})
