import { Fixture } from './general_fixtures'

export const anADOTCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'test-12_adot_frontend',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: 1234,
            message: '2025/05/28 10:13:36 ADOT Collector version: v0.43.3'
          },
          {
            id: 'cloudwatch-log-gmessage-id-2',
            timestamp: 1235,
            message: '2025-05-28T10:13:36.838Z warn awsemfexporter@v0.117.0/emf_exporter.go:92 the default value for DimensionRollupOption will be changing to NoDimensionRollupin a future release. See https://github.com/open-telemetry/opentelemetry-collector-contrib/issues/23997 for moreinformation {"kind": "exporter", "data_type": "metrics", "name": "awsemf"}'
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
          source: 'adot',
          sourcetype: 'generic_single_line',
          index: 'pay_devops',
          event: '2025/05/28 10:13:36 ADOT Collector version: v0.43.3',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          },
          time: 1234.000
        },
        {
          host: 'logStream',
          source: 'adot',
          sourcetype: 'generic_single_line',
          index: 'pay_devops',
          event: '2025-05-28T10:13:36.838Z warn awsemfexporter@v0.117.0/emf_exporter.go:92 the default value for DimensionRollupOption will be changing to NoDimensionRollupin a future release. See https://github.com/open-telemetry/opentelemetry-collector-contrib/issues/23997 for moreinformation {"kind": "exporter", "data_type": "metrics", "name": "awsemf"}',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          },
          time: 1235.000
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}
