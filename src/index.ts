import { Handler, FirehoseTransformationEvent, FirehoseTransformationResult, FirehoseTransformationResultRecord } from 'aws-lambda'

type SplunkRecord = {
  host: string
  source: string
  sourcetype: string
  index: string
  event: string
  fields: {
    account: string
    environment: string
  }
}

type CloudWatchRecordData = {
  owner: string
  logGroup: string
  logStream: string
  subscriptionFilters: []
  messageType: string
  logEvents: [
    {
      id: string
      timestamp: string
      message: string
    }
  ]
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
  'app'
}

function sourceTypeFromLogGroup(logType: CloudWatchLogTypes): string {
  switch(logType) {
    case CloudWatchLogTypes.app:
      return 'ST004:application_json'
  }
}

function sourceFromLogGroup(logGroup: string): string {
  return logGroup.split('_').pop() as string //logGroup is checked in #validateLogGroup
}

function indexFromLogType(logType: CloudWatchLogTypes): string {
  switch(logType) {
    case CloudWatchLogTypes.app:
      return 'pay_application'
  }
}

function extractHostFromCloudWatch(logType: CloudWatchLogTypes, data: CloudWatchRecordData): string {
  switch (logType) {
    case CloudWatchLogTypes.app:
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
  switch(logType) {
    case 'app':
      return CloudWatchLogTypes.app
    default:
      throw new Error(`Unknown log type of "${logType}" taken from log group "${logGroup}"`)
  }
}

function transformCloudWatchData(data: CloudWatchRecordData, envVars: EnvVars): SplunkRecord[] {
  return data.logEvents.map((event) => {
    validateLogGroup(data.logGroup)

    const logType: CloudWatchLogTypes = getLogTypeFromLogGroup(data.logGroup)
    return {
      host: extractHostFromCloudWatch(logType, data),
      source: sourceFromLogGroup(data.logGroup),
      sourcetype: sourceTypeFromLogGroup(logType),
      index: indexFromLogType(logType),
      event: event.message,
      fields: {
        account: envVars.account,
        environment: envVars.environment
      }
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
      index: 'pay_access',
      event: log,
      fields: {
        account: envVars.account,
        environment: envVars.environment
      }
    }
  })
}

function shouldDropRecord(data: object): boolean {
  if('messageType' in data && data.messageType !== 'DATA_MESSAGE') {
    return true
  }
  return false
}

function transformData(data: object, envVars: EnvVars): SplunkRecord[] | void[] {
  if( 'logGroup' in data) {
    return transformCloudWatchData(data as CloudWatchRecordData, envVars)
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
    return {...r, data_decoded: Buffer.from(r.data as string, 'base64').toString()}
  }))
}

export const handler: Handler = async (event: FirehoseTransformationEvent): Promise<FirehoseTransformationResult> => {
  const envVars = getEnvVars()

  const records: FirehoseTransformationResultRecord[] = []
  for (const record of event.records) {
    const recordData = JSON.parse(Buffer.from(record.data, 'base64').toString())

    if (shouldDropRecord(recordData)) {
      records.push({
        recordId: record.recordId,
        result: 'Dropped',
        data: record.data
      })
    } else {
      try{
        const transformedData = transformData(recordData, envVars)
        const joinedData = transformedData.map(x=> JSON.stringify(x)).join('\n')
        records.push({
          recordId: record.recordId,
          result: 'Ok',
          data: Buffer.from(joinedData).toString('base64')
        })
      } catch(e) {
        throw new Error(`Error processing record "${record.recordId}": ${(e as Error).message}`)
      }
    }
  }

  if(process.env.DEBUG === 'true') {
    debugTransformation(records)
  }

  return {
    records
  }
}
