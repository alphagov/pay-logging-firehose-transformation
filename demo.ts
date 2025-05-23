import { FirehoseTransformationResult } from 'aws-lambda'

import { handler } from './src'
import { anApplicationLogCloudWatchEvent, anInvalidApplicationLogFirehoseTransformationEventRecord } from './spec/fixtures/application_fixtures'
import { mockContext, mockCallback } from './spec/fixtures/general_fixtures'

async function runDemo() {
  console.log('Starting demo...')

  process.env.ENVIRONMENT = 'demo-1'
  process.env.AWS_ACCOUNT_NAME = 'demo'
  process.env.AWS_ACCOUNT_ID = '987654321'

  const event = anApplicationLogCloudWatchEvent.input
  event.records = [
    event.records[0],
    anInvalidApplicationLogFirehoseTransformationEventRecord,
    event.records[1]
  ]

  console.log('----------------------------------------------------------------------------------------------')
  console.log('Input event:')
  console.log('----------------------------------------------------------------------------------------------')
  console.log(anApplicationLogCloudWatchEvent.input)
  console.log('----------------------------------------------------------------------------------------------\n\n')

  console.log('----------------------------------------------------------------------------------------------')
  console.log('Decoded data of each input event')
  console.log('----------------------------------------------------------------------------------------------')
  for (const record of event.records) {
    console.log(`Record ID: ${record.recordId}`)
    console.log(JSON.parse(Buffer.from(record.data, 'base64').toString()))
  }
  console.log('----------------------------------------------------------------------------------------------\n\n')

  const result = await handler(anApplicationLogCloudWatchEvent.input, mockContext, mockCallback) as FirehoseTransformationResult

  console.log('----------------------------------------------------------------------------------------------')
  console.log('Return value of handler')
  console.log('----------------------------------------------------------------------------------------------')
  console.log('Result:')
  console.debug(result)
  console.log('----------------------------------------------------------------------------------------------\n\n')

  console.log('----------------------------------------------------------------------------------------------')
  console.log('Decoded data of each transformed event')
  console.log('----------------------------------------------------------------------------------------------')
  for (const record of event.records) {
    console.log(`Record ID: ${record.recordId}`)
    console.log(JSON.parse(Buffer.from(record.data, 'base64').toString()))
  }
  console.log('----------------------------------------------------------------------------------------------\n\n')

  console.log('Finished demo...')
}

void runDemo()
