import { handler } from './src'

import { Context } from 'aws-lambda'
import { FirehoseTransformationCallback } from "aws-lambda/trigger/kinesis-firehose-transformation";

const context: Context = {
  awsRequestId: '',
  callbackWaitsForEmptyEventLoop: true,
  functionName: '',
  functionVersion: '',
  invokedFunctionArn: '',
  logGroupName: '',
  logStreamName: '',
  memoryLimitInMB: '',
  getRemainingTimeInMillis: () => 0,
  done: () => {
  },
  fail: () => {
  },
  succeed: () => {
  }
}

const callback: FirehoseTransformationCallback = () => {
}

const event = {
  'records': [
    {
      'recordId': 'a record id',
      'approximateArrivalTimestamp': 1702212345678,
      'data': 'base-64-encoded-data'
    },
  ],
}

async function runDemo() {
  console.log('Starting demo...')

  await handler(event, context, callback)

  console.log('Finished demo...')
}

runDemo()
