import {
  FirehoseTransformationHandler,
  FirehoseTransformationEvent, FirehoseTransformationResult, FirehoseTransformationResultRecord
} from 'aws-lambda'
import { EnvVars } from './types'
import { transformData } from './transformData'

export const SQUID_ACCESS_LOG_FORMAT_REGEX = /^(\d+\.\d{3})/

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
    aws_account_name: getMandatoryEnvVar('AWS_ACCOUNT_NAME'),
    aws_account_id: getMandatoryEnvVar('AWS_ACCOUNT_ID')
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

      const transformedData = transformData(recordData, envVars, record.approximateArrivalTimestamp)
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
