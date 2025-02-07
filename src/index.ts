import {
  CloudWatchLogsDecodedData,
  Handler,
  FirehoseTransformationEvent, FirehoseTransformationResult, FirehoseTransformationResultRecord
} from 'aws-lambda'

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
  environment: string
  service?: string
}

type S3LogRecord = {
  SourceFile: {
    S3Bucket: string,
    S3Key: string
  },
  S3Bucket?: string,
  ALB?: string,
  AWSAccountID: string,
  AWSAccountName: string,
  Logs: string[]
}

type EnvVars = {
  environment: string,
  account: string
}

// more to be added in later commits
enum CloudWatchLogTypes {
  'app',
  'nginx-forward-proxy',
  'nginx-reverse-proxy'
}

function sourceTypeFromLogGroup(logType: CloudWatchLogTypes): string {
  switch (logType) {
    case CloudWatchLogTypes.app:
      return 'ST004:application_json'
    case CloudWatchLogTypes['nginx-forward-proxy']:
    case CloudWatchLogTypes['nginx-reverse-proxy']:
      return 'nginx:plus:kv'
  }
}

function indexFromLogType(logType: CloudWatchLogTypes): string {
  switch (logType) {
    case CloudWatchLogTypes.app:
      return 'pay_application'
    case CloudWatchLogTypes['nginx-forward-proxy']:
    case CloudWatchLogTypes['nginx-reverse-proxy']:
      return 'pay_ingress'
  }
}

function extractHostFromCloudWatch(logType: CloudWatchLogTypes, data: CloudWatchLogsDecodedData): string {
  switch (logType) {
    case CloudWatchLogTypes.app:
    case CloudWatchLogTypes['nginx-forward-proxy']:
    case CloudWatchLogTypes['nginx-reverse-proxy']:
      return data.logStream
  }
}

function validateLogGroup(logGroup: string): void {
  if (!logGroup || logGroup.split('_').length < 2) {
    throw new Error(`Log group "${logGroup}" must be of format <env>_<type>_<optional subtype>`)
  }
}

function getLogTypeFromLogGroup(logGroup: string): CloudWatchLogTypes {
  const logType = logGroup.split('_')[1]
  switch (logType) {
    case 'app':
      return CloudWatchLogTypes.app
    case 'nginx-forward-proxy':
      return CloudWatchLogTypes['nginx-forward-proxy']
    case 'nginx-reverse-proxy':
      return CloudWatchLogTypes['nginx-reverse-proxy']
    default:
      throw new Error(`Unknown log type of "${logType}" taken from log group "${logGroup}"`)
  }
}

function getServiceFromLogGroup(logGroup: string): string | undefined {
  if (logGroup.split('_').length === 3) {
    return logGroup.split('_')[2]
  }
}

function transformCloudWatchData(data: CloudWatchLogsDecodedData, envVars: EnvVars): SplunkRecord[] {

  validateLogGroup(data.logGroup)

  const logType: CloudWatchLogTypes = getLogTypeFromLogGroup(data.logGroup)
  const host = extractHostFromCloudWatch(logType, data)
  const source = CloudWatchLogTypes[logType]
  const sourcetype = sourceTypeFromLogGroup(logType)
  const index = indexFromLogType(logType)
  const account = envVars.account
  const environment = envVars.environment
  const service = getServiceFromLogGroup(data.logGroup)
  const fields: SplunkFields = {
    account,
    environment
  }

  if (service !== undefined) { fields.service = service }

  return data.logEvents.map((event) => {
    return {
      host,
      source,
      sourcetype,
      index,
      event: event.message,
      fields
    }
  })
}

function transformALBLog(data: S3LogRecord, envVars: EnvVars): SplunkRecord[] {
  return data.Logs.map((log) => {
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

function transformS3AccessLog(data: S3LogRecord, envVars: EnvVars): SplunkRecord[] {
  return data.Logs.map((log) => {
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

function shouldDropRecord(data: object): boolean {
  if ('messageType' in data && data.messageType !== 'DATA_MESSAGE') {
    return true
  }
  return false
}

function transformData(data: object, envVars: EnvVars): SplunkRecord[] {
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

export const handler: Handler = async (event: FirehoseTransformationEvent): Promise<FirehoseTransformationResult> => { // eslint-disable-line @typescript-eslint/require-await
  const envVars = getEnvVars()

  const records: FirehoseTransformationResultRecord[] = []
  for (const record of event.records) {
    try {
      const recordData: unknown = JSON.parse(Buffer.from(record.data, 'base64').toString())
      if (!(recordData instanceof Object)) {
        throw new Error('The record data could not be parsed as an object')
      }

      if (shouldDropRecord(recordData)) {
        records.push({
          recordId: record.recordId,
          result: 'Dropped',
          data: record.data
        })
      } else {
          const transformedData = transformData(recordData, envVars)
          const joinedData = transformedData.map(x => JSON.stringify(x)).join('\n')
          records.push({
            recordId: record.recordId,
            result: 'Ok',
            data: Buffer.from(joinedData).toString('base64')
          })
      }
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
