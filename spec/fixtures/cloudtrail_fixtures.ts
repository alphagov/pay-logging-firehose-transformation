import { Fixture } from './general_fixtures'

export const aCloudTrailLogCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'test_cloudtrail',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: '1234',
            message: '{"eventVersion":"REDACTED","userIdentity":{"type":"REDACTED","principalId":"REDACTED","arn":"REDACTED","accountId":"REDACTED","accessKeyId":"REDACTED","sessionContext":{"sessionIssuer":{"type":"REDACTED","principalId":"REDACTED","arn":"REDACTED","accountId":"REDACTED","userName":"REDACTED"},"attributes":{"creationDate":"REDACTED","mfaAuthenticated":"REDACTED"}},"inScopeOf":{"issuerType":"REDACTED","credentialsIssuedTo":"REDACTED"}},"eventTime":"2025-02-19T15:43:08Z","eventSource":"REDACTED","eventName":"REDACTED","awsRegion":"REDACTED","sourceIPAddress":"REDACTED","userAgent":"REDACTED","requestParameters":{"trailNameList":[],"includeShadowTrails":"REDACTED"},"responseElements":"REDACTED","requestID":"REDACTED","eventID":"REDACTED","readOnly":"REDACTED","eventType":"REDACTED","managementEvent":"REDACTED","recipientAccountId":"REDACTED","eventCategory":"REDACTED","tlsDetails":{"tlsVersion":"REDACTED","cipherSuite":"REDACTED","clientProvidedHostHeader":"REDACTED"}}'
          },
          {
            id: 'cloudwatch-log-gmessage-id-2',
            timestamp: '12345',
            message: '{"eventVersion":"REDACTED","userIdentity":{"type":"REDACTED","principalId":"REDACTED","arn":"REDACTED","accountId":"REDACTED","accessKeyId":"REDACTED","sessionContext":{"sessionIssuer":{"type":"REDACTED","principalId":"REDACTED","arn":"REDACTED","accountId":"REDACTED","userName":"REDACTED"},"attributes":{"creationDate":"REDACTED","mfaAuthenticated":"REDACTED"}},"inScopeOf":{"issuerType":"REDACTED","credentialsIssuedTo":"REDACTED"}},"eventTime":"2025-02-19T15:43:08Z","eventSource":"REDACTED","eventName":"REDACTED","awsRegion":"REDACTED","sourceIPAddress":"REDACTED","userAgent":"REDACTED","requestParameters":{"trailNameList":[],"includeShadowTrails":"REDACTED"},"responseElements":"REDACTED","requestID":"REDACTED","eventID":"REDACTED","readOnly":"REDACTED","eventType":"REDACTED","managementEvent":"REDACTED","recipientAccountId":"REDACTED","eventCategory":"REDACTED","tlsDetails":{"tlsVersion":"REDACTED","cipherSuite":"REDACTED","clientProvidedHostHeader":"REDACTED"}}'
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
          host: 'test',
          source: 'cloudtrail',
          sourcetype: 'aws:cloudtrail',
          index: 'pay_platform',
          event: '{"eventVersion":"REDACTED","userIdentity":{"type":"REDACTED","principalId":"REDACTED","arn":"REDACTED","accountId":"REDACTED","accessKeyId":"REDACTED","sessionContext":{"sessionIssuer":{"type":"REDACTED","principalId":"REDACTED","arn":"REDACTED","accountId":"REDACTED","userName":"REDACTED"},"attributes":{"creationDate":"REDACTED","mfaAuthenticated":"REDACTED"}},"inScopeOf":{"issuerType":"REDACTED","credentialsIssuedTo":"REDACTED"}},"eventTime":"2025-02-19T15:43:08Z","eventSource":"REDACTED","eventName":"REDACTED","awsRegion":"REDACTED","sourceIPAddress":"REDACTED","userAgent":"REDACTED","requestParameters":{"trailNameList":[],"includeShadowTrails":"REDACTED"},"responseElements":"REDACTED","requestID":"REDACTED","eventID":"REDACTED","readOnly":"REDACTED","eventType":"REDACTED","managementEvent":"REDACTED","recipientAccountId":"REDACTED","eventCategory":"REDACTED","tlsDetails":{"tlsVersion":"REDACTED","cipherSuite":"REDACTED","clientProvidedHostHeader":"REDACTED"}}',
          fields: {
            account: 'test'
          },
          time: 1739979788.000
        },
        {
          host: 'test',
          source: 'cloudtrail',
          sourcetype: 'aws:cloudtrail',
          index: 'pay_platform',
          event: '{"eventVersion":"REDACTED","userIdentity":{"type":"REDACTED","principalId":"REDACTED","arn":"REDACTED","accountId":"REDACTED","accessKeyId":"REDACTED","sessionContext":{"sessionIssuer":{"type":"REDACTED","principalId":"REDACTED","arn":"REDACTED","accountId":"REDACTED","userName":"REDACTED"},"attributes":{"creationDate":"REDACTED","mfaAuthenticated":"REDACTED"}},"inScopeOf":{"issuerType":"REDACTED","credentialsIssuedTo":"REDACTED"}},"eventTime":"2025-02-19T15:43:08Z","eventSource":"REDACTED","eventName":"REDACTED","awsRegion":"REDACTED","sourceIPAddress":"REDACTED","userAgent":"REDACTED","requestParameters":{"trailNameList":[],"includeShadowTrails":"REDACTED"},"responseElements":"REDACTED","requestID":"REDACTED","eventID":"REDACTED","readOnly":"REDACTED","eventType":"REDACTED","managementEvent":"REDACTED","recipientAccountId":"REDACTED","eventCategory":"REDACTED","tlsDetails":{"tlsVersion":"REDACTED","cipherSuite":"REDACTED","clientProvidedHostHeader":"REDACTED"}}',
          fields: {
            account: 'test'
          },
          time: 1739979788.000
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}
