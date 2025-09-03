export type SplunkRecord = {
  time: number
  host: string
  source: string
  sourcetype: string
  index: string
  event: string
  fields: SplunkFields
}

export type TransformationResult = {
  result: 'Ok' | 'Dropped' | 'ProcessingFailed'
  splunkRecords: SplunkRecord[]
}
export type SplunkFields = {
  account: string
  environment?: string
  service?: string
}

export type S3LogRecord = {
  SourceFile: {
    S3Bucket: string
    S3Key: string
  }
  S3Bucket?: string
  ALB?: string
  AWSAccountID: string
  AWSAccountName: string
  Logs: string[]
}

export type EnvVars = {
  environment?: string
  aws_account_name: string
  aws_account_id: string
}

export enum CloudWatchLogTypes {
  'adot',
  'app',
  'apt',
  'audit',
  'auth',
  'bastion',
  'concourse',
  'cloudtrail',
  'dmesg',
  'grafana',
  'kern',
  'nginx-forward-proxy',
  'nginx-reverse-proxy',
  'syslog',
  'squid',
  'vpc-flow-logs',
  'waf'
}
