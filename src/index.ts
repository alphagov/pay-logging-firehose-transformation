import {
  CloudWatchLogsDecodedData,
  FirehoseTransformationHandler,
  FirehoseTransformationEvent, FirehoseTransformationResult, FirehoseTransformationResultRecord
} from 'aws-lambda'

type TransformationResult = {
  result: 'Ok' | 'Dropped' | 'ProcessingFailed'
  splunkRecords: SplunkRecord[]
}

type SplunkRecord = {
  host: string
  source: string
  sourcetype: string
  index: string
  event: string
  fields: SplunkFields
}

type SplunkFields = {
  account: string
  environment?: string
  service?: string
}

type S3LogRecord = {
  SourceFile: {
    S3Bucket: string
    S3Key: string
  }
  S3Bucket?: string
  ALB?: string
  AWSAccountID: string
  AWSAccountName: string
  Logs: string[]
}

type EnvVars = {
  environment: string
  account: string
}

// more to be added in later commits
enum CloudWatchLogTypes {
  'app',
  'apt',
  'audit',
  'auth',
  'concourse',
  'cloudtrail',
  'dmesg',
  'kern',
  'nginx-forward-proxy',
  'nginx-reverse-proxy',
  'syslog',
  'squid',
  'vpc-flow-logs'
}

const SQUID_ACCESS_LOG_FORMAT_REGEX = /^\d+\.\d{3} /

function squidSourceType(msg: string): string {
  if (msg.match(SQUID_ACCESS_LOG_FORMAT_REGEX)) {
    return 'squid:access'
  }
  return 'ST004:squid:cache'
}

function sourceTypeFromLogGroup(logType: CloudWatchLogTypes, msg: string): string {
  switch (logType) {
    case CloudWatchLogTypes.app:
      return 'ST004:application_json'
    case CloudWatchLogTypes['nginx-forward-proxy']:
    case CloudWatchLogTypes['nginx-reverse-proxy']:
      return 'nginx:plus:kv'
    case CloudWatchLogTypes['syslog']:
    case CloudWatchLogTypes['kern']:
      return 'linux_messages_syslog'
    case CloudWatchLogTypes['audit']:
      return 'linux_audit'
    case CloudWatchLogTypes['auth']:
      return 'linux_secure'
    case CloudWatchLogTypes['dmesg']:
      return 'dmesg'
    case CloudWatchLogTypes['apt']:
      return 'generic_single_line'
    case CloudWatchLogTypes['concourse']:
      return 'ST004:concourse'
    case CloudWatchLogTypes['squid']:
      return squidSourceType(msg)
    case CloudWatchLogTypes['cloudtrail']:
      return 'aws:cloudtrail'
    case CloudWatchLogTypes['vpc-flow-logs']:
      return 'aws:cloudwatchlogs:vpcflow'
  }
}

function indexFromLogType(logType: CloudWatchLogTypes): string {
  switch (logType) {
    case CloudWatchLogTypes.app:
      return 'pay_application'
    case CloudWatchLogTypes['nginx-forward-proxy']:
    case CloudWatchLogTypes['nginx-reverse-proxy']:
      return 'pay_ingress'
    case CloudWatchLogTypes['apt']:
    case CloudWatchLogTypes['audit']:
    case CloudWatchLogTypes['auth']:
    case CloudWatchLogTypes['concourse']:
    case CloudWatchLogTypes['dmesg']:
    case CloudWatchLogTypes['kern']:
    case CloudWatchLogTypes['syslog']:
      return 'pay_devops'
    case CloudWatchLogTypes['squid']:
      return 'pay_egress'
    case CloudWatchLogTypes['cloudtrail']:
    case CloudWatchLogTypes['vpc-flow-logs']:
      return 'pay_platform'
  }
}

function validateLogGroup(logGroup: string): void {
  if (!logGroup || logGroup.split('_').length < 2) {
    throw new Error(`Log group "${logGroup}" must be of format <env>_<type>_<optional subtype>`)
  }
}

function getLogTypeFromLogGroup(logGroup: string): CloudWatchLogTypes {
  const logType: string = logGroup.split('_')[1]

  if (Object.values(CloudWatchLogTypes).includes(logType)) {
    return CloudWatchLogTypes[logType as keyof typeof CloudWatchLogTypes] as CloudWatchLogTypes
  }
  throw new Error(`Unknown log type of "${logType}" taken from log group "${logGroup}"`)
}

function getServiceFromLogGroup(logGroup: string): string | undefined {
  if (logGroup.split('_').length === 3) {
    return logGroup.split('_')[2]
  }
}

function shouldSendFlowLogToSplunk(msg: string): boolean {
  // Only send accepted connections that were NOT tcp, udp or icmp.
  const ICMP_VALUE = '1'
  const TCP_VALUE = '6'
  const UDP_VALUE = '17'
  const rejectedProtocols = [ICMP_VALUE, TCP_VALUE, UDP_VALUE]

  const fields = msg.split(' ')
  const protocol = fields[7]
  const action = fields[12]

  return action === 'ACCEPT' && !rejectedProtocols.includes(protocol)
}

function transformCloudWatchData(data: CloudWatchLogsDecodedData, envVars: EnvVars): TransformationResult {
  if (data.messageType !== 'DATA_MESSAGE') {
    return {
      result: 'Dropped',
      splunkRecords: []
    }
  }

  validateLogGroup(data.logGroup)

  const logType: CloudWatchLogTypes = getLogTypeFromLogGroup(data.logGroup)
  const host = logType === CloudWatchLogTypes['cloudtrail'] ? envVars.account : data.logStream
  const source = CloudWatchLogTypes[logType]
  const index = indexFromLogType(logType)
  const account = envVars.account
  const fields: SplunkFields = {
    account
  }

  if (logType !== CloudWatchLogTypes['cloudtrail']) {
    fields.environment = envVars.environment
  }

  const service = getServiceFromLogGroup(data.logGroup)
  if (service !== undefined) {
    fields.service = service
  }

  const splunkRecords = data.logEvents.filter((event) => {
    return logType !== CloudWatchLogTypes['vpc-flow-logs'] || shouldSendFlowLogToSplunk(event.message)
  }).map((event) => {
    return {
      host,
      source,
      sourcetype: sourceTypeFromLogGroup(logType, event.message),
      index,
      event: event.message,
      fields
    }
  })

  return {
    result: splunkRecords.length > 0 ? 'Ok' : 'Dropped',
    splunkRecords
  }
}

function transformALBLog(data: S3LogRecord, envVars: EnvVars): TransformationResult {
  return {
    result: 'Ok',
    splunkRecords: data.Logs.map((log) => {
      return {
        host: data.ALB as string,
        source: 'ALB',
        sourcetype: 'aws:elb:accesslogs',
        index: 'pay_ingress',
        event: log,
        fields: {
          account: envVars.account,
          environment: envVars.environment
        }
      }
    })
  }
}

function transformS3AccessLog(data: S3LogRecord, envVars: EnvVars): TransformationResult {
  return {
    result: 'Ok',
    splunkRecords: data.Logs.map((log) => {
      return {
        host: data.S3Bucket as string,
        source: 'S3',
        sourcetype: 'aws:s3:accesslogs',
        index: 'pay_storage',
        event: log,
        fields: {
          account: envVars.account,
          environment: envVars.environment
        }
      }
    })
  }
}

function transformData(data: object, envVars: EnvVars): TransformationResult {
  if ('logGroup' in data) {
    return transformCloudWatchData(data as CloudWatchLogsDecodedData, envVars)
  } else if ('ALB' in data) {
    return transformALBLog(data as S3LogRecord, envVars)
  } else if ('S3Bucket' in data) {
    return transformS3AccessLog(data as S3LogRecord, envVars)
  }
  throw new Error('Cannot parse information from record data because it is an unregonised structure.')
}

function getMandatoryEnvVar(varName: string): string {
  const value = process.env[varName]
  if (!value) {
    throw new Error(`"${varName}" env var is not set`)
  }
  return value
}

function getEnvVars(): EnvVars {
  return {
    environment: getMandatoryEnvVar('ENVIRONMENT'),
    account: getMandatoryEnvVar('ACCOUNT')
  }
}

function debugTransformation(records: FirehoseTransformationResultRecord[]): void {
  console.log(records.map((r) => {
    return { ...r, data_decoded: Buffer.from(r.data as string, 'base64').toString() }
  }))
}

export const handler: FirehoseTransformationHandler = async (event: FirehoseTransformationEvent): Promise<FirehoseTransformationResult> => { // eslint-disable-line @typescript-eslint/require-await
  const envVars = getEnvVars()

  const records: FirehoseTransformationResultRecord[] = []
  for (const record of event.records) {
    try {
      const recordData: unknown = JSON.parse(Buffer.from(record.data, 'base64').toString())
      if (!(recordData instanceof Object)) {
        throw new Error('The record data could not be parsed as an object')
      }

      const transformedData = transformData(recordData, envVars)
      const joinedData = transformedData.splunkRecords.map(x => JSON.stringify(x)).join('\n')
      records.push({
        recordId: record.recordId,
        result: transformedData.result,
        data: Buffer.from(joinedData).toString('base64')
      })
    } catch (e) {
      let errorMessage: string

      if (e instanceof Error) {
        errorMessage = `Error processing record "${record.recordId}": ${e.message}`
      } else {
        errorMessage = `Error processing record "${record.recordId}", got an exception not of the Error type`
      }
      console.error(errorMessage)
      records.push({
        recordId: record.recordId,
        result: 'ProcessingFailed',
        data: record.data
      })
    }
  }

  if (process.env.DEBUG === 'true') {
    debugTransformation(records)
  }

  return {
    records
  }
}
