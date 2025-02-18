import { FirehoseTransformationEventRecord } from 'aws-lambda'
import { Fixture } from './general_fixtures'

export const anInvalidApplicationLogFirehoseTransformationEventRecord: FirehoseTransformationEventRecord = {
  approximateArrivalTimestamp: 1234,
  recordId: 'InvalidLogEvent-1',
  data: Buffer.from(JSON.stringify({
    owner: '223851549868',
    logGroup: 'badLogGroupName',
    logStream: 'frontendECSTaskId',
    subscriptionFilters: [],
    messageType: 'DATA_MESSAGE',
    logEvents: [
      {
        id: 'cloudwatch-log-message-id-1',
        timestamp: '1234',
        message: 'Log event message 1'
      },
      {
        id: 'cloudwatch-log-gmessage-id-2',
        timestamp: '12345',
        message: 'Log event message 2'
      }
    ]
  })).toString('base64')
}

export const anApplicationLogCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'test-12_app_frontend',
        logStream: 'frontendECSTaskId',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: '1234',
            message: '{"@timestamp": "2025-02-18T10:07:24.093Z","@version": 1, "container": "frontend", "environment": "test-12", "http_version": "1.0", "level": "INFO", "logger_name": "/app/app/middleware/logging-middleware.js", "message": "Request received", "method": "GET", "remote_address": "15.177.18.167", "response_time": "3.312 ms", "status_code": "200", "url": "/healthcheck", "user_agent": "Amazon-Route53-Health-Check-Service (ref 6b4f1794-fb11-4e80-bdde-241b02e47a79; report http://amzn.to/1vsZADi)", "x_request_id": "06d501244509bc2ce935318a9116496e"}'
          },
          {
            id: 'cloudwatch-log-gmessage-id-2',
            timestamp: '12345',
            message: '{"@timestamp": "2025-02-18T10:11:24.093Z","@version": 1, "container": "frontend", "environment": "test-12", "http_version": "1.0", "level": "INFO", "logger_name": "/app/app/middleware/logging-middleware.js", "message": "Request received", "method": "GET", "remote_address": "15.177.18.167", "response_time": "3.312 ms", "status_code": "200", "url": "/healthcheck", "user_agent": "Amazon-Route53-Health-Check-Service (ref 6b4f1794-fb11-4e80-bdde-241b02e47a79; report http://amzn.to/1vsZADi)", "x_request_id": "06d501244509bc2ce935318a9116496e"}'
          }
        ]
      })).toString('base64')
    },
    {
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-2',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'test-12_app_connector',
        logStream: 'connectorECSTaskId',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: '1234',
            message: '{"container": "connector","status_code": 200,"method": "GET","x_request_id": "-","http_version": "HTTP/1.0","remote_address": "172.18.34.11","url": "/healthcheck","environment": "test-12","@timestamp": "2025-02-18T10:14:22.199+0000","@version": 1,"response_time": 31,"content_length": 249,"user_agent": "ELB-HealthChecker/2.0"}'
          },
          {
            id: 'cloudwatch-log-gmessage-id-2',
            timestamp: '12345',
            message: '{"container": "connector","status_code": 200,"method": "GET","x_request_id": "-","http_version": "HTTP/1.0","remote_address": "172.18.34.11","url": "/healthcheck","environment": "test-12","@timestamp": "2025-02-18T10:15:22.199+0000","@version": 1,"response_time": 31,"content_length": 249,"user_agent": "ELB-HealthChecker/2.0"}'
          }
        ]
      })).toString('base64')
    }
    ]
  },
  expected: {
    records: [{
      result: 'Ok',
      recordId: 'LogEvent-1',
      data: Buffer.from([
        {
          host: 'frontendECSTaskId',
          source: 'app',
          sourcetype: 'ST004:application_json',
          index: 'pay_application',
          event: '{"@timestamp": "2025-02-18T10:07:24.093Z","@version": 1, "container": "frontend", "environment": "test-12", "http_version": "1.0", "level": "INFO", "logger_name": "/app/app/middleware/logging-middleware.js", "message": "Request received", "method": "GET", "remote_address": "15.177.18.167", "response_time": "3.312 ms", "status_code": "200", "url": "/healthcheck", "user_agent": "Amazon-Route53-Health-Check-Service (ref 6b4f1794-fb11-4e80-bdde-241b02e47a79; report http://amzn.to/1vsZADi)", "x_request_id": "06d501244509bc2ce935318a9116496e"}',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          },
          time: 1739873244.093
        },
        {
          host: 'frontendECSTaskId',
          source: 'app',
          sourcetype: 'ST004:application_json',
          index: 'pay_application',
          event: '{"@timestamp": "2025-02-18T10:11:24.093Z","@version": 1, "container": "frontend", "environment": "test-12", "http_version": "1.0", "level": "INFO", "logger_name": "/app/app/middleware/logging-middleware.js", "message": "Request received", "method": "GET", "remote_address": "15.177.18.167", "response_time": "3.312 ms", "status_code": "200", "url": "/healthcheck", "user_agent": "Amazon-Route53-Health-Check-Service (ref 6b4f1794-fb11-4e80-bdde-241b02e47a79; report http://amzn.to/1vsZADi)", "x_request_id": "06d501244509bc2ce935318a9116496e"}',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          },
          time: 1739873484.093
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }, {
      result: 'Ok',
      recordId: 'LogEvent-2',
      data: Buffer.from([
        {
          host: 'connectorECSTaskId',
          source: 'app',
          sourcetype: 'ST004:application_json',
          index: 'pay_application',
          event: '{"container": "connector","status_code": 200,"method": "GET","x_request_id": "-","http_version": "HTTP/1.0","remote_address": "172.18.34.11","url": "/healthcheck","environment": "test-12","@timestamp": "2025-02-18T10:14:22.199+0000","@version": 1,"response_time": 31,"content_length": 249,"user_agent": "ELB-HealthChecker/2.0"}',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'connector'
          },
          time: 1739873662.199
        },
        {
          host: 'connectorECSTaskId',
          source: 'app',
          sourcetype: 'ST004:application_json',
          index: 'pay_application',
          event: '{"container": "connector","status_code": 200,"method": "GET","x_request_id": "-","http_version": "HTTP/1.0","remote_address": "172.18.34.11","url": "/healthcheck","environment": "test-12","@timestamp": "2025-02-18T10:15:22.199+0000","@version": 1,"response_time": 31,"content_length": 249,"user_agent": "ELB-HealthChecker/2.0"}',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'connector'
          },
          time: 1739873722.199
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}
