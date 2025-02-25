import { Fixture } from './general_fixtures'

export const anNginxForwardProxyCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'test-12_nginx-forward-proxy_frontend',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: '1234',
            message: 'server="www.gov.uk" dest_port="8888" dest_ip="172.20.0.2" src="172.20.0.3" src_ip="172.20.0.3" time_local="18/Feb/2025:19:59:58 +0000" protocol="HTTP/1.1" status="200" bytes_out="73735" bytes_in="73728" http_referer="-" http_user_agent="-" nginx_version="1.27.4" http_x_forwarded_for="-" http_x_header="-" uri_query="-" uri_path="/" http_method="GET" response_time="0.052" request_time="0.065" category="text/html; charset=utf-8" https="" x_request_id="test-x-request-id"'
          },
          {
            id: 'cloudwatch-log-gmessage-id-2',
            timestamp: '12345',
            message: 'server="www.gov.uk" dest_port="8888" dest_ip="172.20.0.2" src="172.20.0.3" src_ip="172.20.0.3" time_local="18/Feb/2025:19:59:58 +0000" protocol="HTTP/1.1" status="200" bytes_out="73735" bytes_in="73728" http_referer="-" http_user_agent="-" nginx_version="1.27.4" http_x_forwarded_for="-" http_x_header="-" uri_query="-" uri_path="/" http_method="GET" response_time="0.052" request_time="0.065" category="text/html; charset=utf-8" https="" x_request_id="test-x-request-id"'
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
          source: 'nginx-forward-proxy',
          sourcetype: 'nginx:plus:kv',
          index: 'pay_ingress',
          event: 'server="www.gov.uk" dest_port="8888" dest_ip="172.20.0.2" src="172.20.0.3" src_ip="172.20.0.3" time_local="18/Feb/2025:19:59:58 +0000" protocol="HTTP/1.1" status="200" bytes_out="73735" bytes_in="73728" http_referer="-" http_user_agent="-" nginx_version="1.27.4" http_x_forwarded_for="-" http_x_header="-" uri_query="-" uri_path="/" http_method="GET" response_time="0.052" request_time="0.065" category="text/html; charset=utf-8" https="" x_request_id="test-x-request-id"',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          },
          time: 1739908798.000
        },
        {
          host: 'logStream',
          source: 'nginx-forward-proxy',
          sourcetype: 'nginx:plus:kv',
          index: 'pay_ingress',
          event: 'server="www.gov.uk" dest_port="8888" dest_ip="172.20.0.2" src="172.20.0.3" src_ip="172.20.0.3" time_local="18/Feb/2025:19:59:58 +0000" protocol="HTTP/1.1" status="200" bytes_out="73735" bytes_in="73728" http_referer="-" http_user_agent="-" nginx_version="1.27.4" http_x_forwarded_for="-" http_x_header="-" uri_query="-" uri_path="/" http_method="GET" response_time="0.052" request_time="0.065" category="text/html; charset=utf-8" https="" x_request_id="test-x-request-id"',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          },
          time: 1739908798.000
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const anNginxReverseProxyCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'test-12_nginx-reverse-proxy_frontend',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'cloudwatch-log-message-id-1',
            timestamp: '1234',
            message: 'server="publicapi.test.pymnt.uk" dest_port="50203" dest_ip="172.18.42.146" src="15.177.6.232" src_ip="172.18.31.120" time_local="19/Feb/2025:09:09:40 +0000" protocol="HTTP/1.1" status="200" bytes_out="383" bytes_in="185" http_referer="" http_user_agent="Amazon-Route53-Health-Check-Service (ref 819f75f9-e072-49e6-9ec6-18a3c70016fd; report http://amzn.to/1vsZADi)" nginx_version="1.26.2" http_x_forwarded_for="15.177.6.232" http_x_header="-" uri_query="" uri_path="/healthcheck" http_method="GET" response_time="0.002" request_time="0.002" category="application/json" https="on" x_request_id="6e2583d9e75385efb7c1cf9b2eadd0b8"'
          },
          {
            id: 'cloudwatch-log-gmessage-id-2',
            timestamp: '12345',
            message: 'server="publicapi.test.pymnt.uk" dest_port="50203" dest_ip="172.18.42.146" src="15.177.10.34" src_ip="172.18.31.120" time_local="19/Feb/2025:09:09:39 +0000" protocol="HTTP/1.1" status="200" bytes_out="383" bytes_in="185" http_referer="" http_user_agent="Amazon-Route53-Health-Check-Service (ref 819f75f9-e072-49e6-9ec6-18a3c70016fd; report http://amzn.to/1vsZADi)" nginx_version="1.26.2" http_x_forwarded_for="15.177.10.34" http_x_header="-" uri_query="" uri_path="/healthcheck" http_method="GET" response_time="0.002" request_time="0.002" category="application/json" https="on" x_request_id="5bf1b81c49c179b096b33ace5841a5b4"'
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
          source: 'nginx-reverse-proxy',
          sourcetype: 'nginx:plus:kv',
          index: 'pay_ingress',
          event: 'server="publicapi.test.pymnt.uk" dest_port="50203" dest_ip="172.18.42.146" src="15.177.6.232" src_ip="172.18.31.120" time_local="19/Feb/2025:09:09:40 +0000" protocol="HTTP/1.1" status="200" bytes_out="383" bytes_in="185" http_referer="" http_user_agent="Amazon-Route53-Health-Check-Service (ref 819f75f9-e072-49e6-9ec6-18a3c70016fd; report http://amzn.to/1vsZADi)" nginx_version="1.26.2" http_x_forwarded_for="15.177.6.232" http_x_header="-" uri_query="" uri_path="/healthcheck" http_method="GET" response_time="0.002" request_time="0.002" category="application/json" https="on" x_request_id="6e2583d9e75385efb7c1cf9b2eadd0b8"',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          },
          time: 1739956180.000
        },
        {
          host: 'logStream',
          source: 'nginx-reverse-proxy',
          sourcetype: 'nginx:plus:kv',
          index: 'pay_ingress',
          event: 'server="publicapi.test.pymnt.uk" dest_port="50203" dest_ip="172.18.42.146" src="15.177.10.34" src_ip="172.18.31.120" time_local="19/Feb/2025:09:09:39 +0000" protocol="HTTP/1.1" status="200" bytes_out="383" bytes_in="185" http_referer="" http_user_agent="Amazon-Route53-Health-Check-Service (ref 819f75f9-e072-49e6-9ec6-18a3c70016fd; report http://amzn.to/1vsZADi)" nginx_version="1.26.2" http_x_forwarded_for="15.177.10.34" http_x_header="-" uri_query="" uri_path="/healthcheck" http_method="GET" response_time="0.002" request_time="0.002" category="application/json" https="on" x_request_id="5bf1b81c49c179b096b33ace5841a5b4"',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          },
          time: 1739956179.000
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}

export const anNginxReverProxyErrorCloudWatchEvent: Fixture = {
  input: {
    deliveryStreamArn: 'someDeliveryStreamArn',
    invocationId: 'someId',
    region: 'eu-west-1',
    records: [{
      approximateArrivalTimestamp: 1234,
      recordId: 'LogEvent-1',
      data: Buffer.from(JSON.stringify({
        owner: '223851549868',
        logGroup: 'test-12_nginx-reverse-proxy_frontend',
        logStream: 'logStream',
        subscriptionFilters: [],
        messageType: 'DATA_MESSAGE',
        logEvents: [
          {
            id: 'a-naxsi-block',
            timestamp: '1234',
            message: '2025/02/25 11:09:14 [error] 51#51: *81035 NAXSI_FMT: ip=107.174.11.239&server=0.0.0.0&uri=/something&vers=1.3&total_processed=81047&total_blocked=2081&config=block&zone0=BODY&id0=11&var_name0=, client: 0.0.0.0, server: $host, request: "POST /something HTTP/1.1", host: "0.0.0.0."'
          },
          {
            id: 'some-warn-level-message',
            timestamp: '12345',
            message: '2025/02/25 11:10:14 [warn]'
          },
          {
            id: 'some-crit-level-message',
            timestamp: '12345',
            message: '2025/02/25 11:10:15 [crit]'
          },
          {
            id: 'some-alert-level-message',
            timestamp: '12345',
            message: '2025/02/25 11:10:16 [alert]'
          },
          {
            id: 'some-emerg-level-message',
            timestamp: '12345',
            message: '2025/02/25 11:10:17 [emerg]'
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
          source: 'nginx-reverse-proxy',
          sourcetype: 'nginx:plus:kv',
          index: 'pay_ingress',
          event: '2025/02/25 11:09:14 [error] 51#51: *81035 NAXSI_FMT: ip=107.174.11.239&server=0.0.0.0&uri=/something&vers=1.3&total_processed=81047&total_blocked=2081&config=block&zone0=BODY&id0=11&var_name0=, client: 0.0.0.0, server: $host, request: "POST /something HTTP/1.1", host: "0.0.0.0."',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          },
          time: 1740481754.000
        },
        {
          host: 'logStream',
          source: 'nginx-reverse-proxy',
          sourcetype: 'nginx:plus:kv',
          index: 'pay_ingress',
          event: '2025/02/25 11:10:14 [warn]',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          },
          time: 1740481814.000
        },
        {
          host: 'logStream',
          source: 'nginx-reverse-proxy',
          sourcetype: 'nginx:plus:kv',
          index: 'pay_ingress',
          event: '2025/02/25 11:10:15 [crit]',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          },
          time: 1740481815.000
        },
        {
          host: 'logStream',
          source: 'nginx-reverse-proxy',
          sourcetype: 'nginx:plus:kv',
          index: 'pay_ingress',
          event: '2025/02/25 11:10:16 [alert]',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          },
          time: 1740481816.000
        },
        {
          host: 'logStream',
          source: 'nginx-reverse-proxy',
          sourcetype: 'nginx:plus:kv',
          index: 'pay_ingress',
          event: '2025/02/25 11:10:17 [emerg]',
          fields: {
            account: 'test',
            environment: 'test-12',
            service: 'frontend'
          },
          time: 1740481817.000
        }
      ].map(x => JSON.stringify(x)).join('\n')).toString('base64')
    }]
  }
}
