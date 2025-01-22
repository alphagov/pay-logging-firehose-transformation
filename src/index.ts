import { Handler, FirehoseTransformationEvent, FirehoseTransformationEventRecord } from 'aws-lambda'

export const handler: Handler = async (event: FirehoseTransformationEvent) => {
  const output = event.records.map((record: FirehoseTransformationEventRecord) => ({
    recordId: record.recordId,
    result: 'Ok',
    data: record.data,
  }))

  return output
}
