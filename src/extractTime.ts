import { SQUID_ACCESS_LOG_FORMAT_REGEX } from './index'
import { CloudWatchLogTypes } from './types'

function regexTimeFromLog(regex: RegExp, log: string): RegExpMatchArray | undefined {
  const logTimeMatches = log.match(regex)
  if (logTimeMatches === null || logTimeMatches.length < 1) {
    console.error(`Failed to extract time from log using "${regex}"`)
    return undefined
  }
  return logTimeMatches
}

function parseStringToEpoch(dateString: string): number | undefined {
  const epoch = Date.parse(dateString)
  if (isNaN(epoch)) {
    console.error(`Failed to parse log time of "${dateString}" into an epoch`)
    return undefined
  }
  return epoch / 1000
}

export function extractAppLogTime(log: string): number | undefined {
  const regex = /"@timestamp"\s*:\s*"(.*?)"/
  const extractedTime = regexTimeFromLog(regex, log)
  if (extractedTime === undefined) {
    return undefined
  }

  return parseStringToEpoch(extractedTime[1])
}

export function extractSquidLogTime(log: string): number | undefined {
  let extractedTime = regexTimeFromLog(SQUID_ACCESS_LOG_FORMAT_REGEX, log)
  if (extractedTime !== undefined) {
    return Number(extractedTime[1])
  } else { // try to extract a time from a cache log
    const cacheLogRegex = /(?<year>\d+)\/(?<month>\d+)\/(?<day>\d+) (?<hours>\d+):(?<minutes>\d+):(?<seconds>\d+)/
    extractedTime = regexTimeFromLog(cacheLogRegex, log)
    if (extractedTime === undefined) {
      return undefined
    }
    const { year, month, day, hours, minutes, seconds } = extractedTime.groups!
    const dateTimeString = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`

    return parseStringToEpoch(dateTimeString)
  }
}

export function extractSysLogTime(log: string): number | undefined {
  const regex = /^(?<month>\w+) (?<day>\d+) (?<hours>\d+):(?<minutes>\d+):(?<seconds>\d+) /
  const extractedTime = regexTimeFromLog(regex, log)
  if (extractedTime === undefined) {
    return undefined
  }
  const year = new Date().getFullYear()
  const { month, day, hours, minutes, seconds } = extractedTime.groups!
  const dateTimeString = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`

  return parseStringToEpoch(dateTimeString)
}

export function extractAuditLogTime(log: string): number | undefined {
  const regex = /msg=audit\((\d+\.\d{3}):\d+\)/
  const extractedTime = regexTimeFromLog(regex, log)
  if (extractedTime === undefined) {
    return undefined
  }

  return Number(extractedTime[1])
}

export function extractConcourseLogTime(log: string): number | undefined {
  const regex = /"timestamp"\s*:\s*"(.*?)"/
  const extractedTime = regexTimeFromLog(regex, log)
  if (extractedTime === undefined) {
    return undefined
  }

  return parseStringToEpoch(extractedTime[1])
}

export function extractCloudTrailLogTime(log: string): number | undefined {
  const regex = /"eventTime":"(.*?)"/
  const extractedTime = regexTimeFromLog(regex, log)
  if (extractedTime === undefined) {
    return undefined
  }

  return parseStringToEpoch(extractedTime[1])
}

export function extractNginxKvLogTime(log: string): number | undefined {
  let regex: RegExp
  if (log.match(/\[error|warn|crit|alert|emerg\]/) !== null) {
    regex = /^\s?(?<year>\d+)\/(?<month>\d+)\/(?<day>\d+) (?<time>.*?) /
  } else {
    regex = /time_local="(?<day>\d+)\/(?<month>\w+)\/(?<year>\d{4}):(?<time>.*?)"/
  }

  const extractedTime = regexTimeFromLog(regex, log)
  if (extractedTime === undefined) {
    return undefined
  }
  const { year, month, day, time } = extractedTime.groups!
  const dateTimeString = `${year}/${month}/${day} ${time}`

  return parseStringToEpoch(dateTimeString)
}

export function extractS3AccessLogLineTime(log: string): number | undefined {
  const regex = /\[(?<day>\d{2})\/(?<month>\w{3})\/(?<year>\d{4}):(?<hours>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2}) \+\d{4}\]/
  const extractedTime = regexTimeFromLog(regex, log)
  if (extractedTime === undefined) {
    return undefined
  }
  const { year, month, day, hours, minutes, seconds } = extractedTime.groups!
  const dateTimeString = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`

  return parseStringToEpoch(dateTimeString)
}

export function extractAlbLogLineTime(log: string): number | undefined {
  const regex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z)/
  const extractedTime = regexTimeFromLog(regex, log)
  if (extractedTime === undefined) {
    return undefined
  }

  return parseStringToEpoch(extractedTime[1])
}

export function parseTimeFromLog(log: string, logType: CloudWatchLogTypes): number | undefined {
  switch (logType) {
    case CloudWatchLogTypes.app:
      return extractAppLogTime(log)
    case CloudWatchLogTypes.squid:
      return extractSquidLogTime(log)
    case CloudWatchLogTypes.syslog:
    case CloudWatchLogTypes.auth:
    case CloudWatchLogTypes.kern:
      return extractSysLogTime(log)
    case CloudWatchLogTypes.audit:
      return extractAuditLogTime(log)
    case CloudWatchLogTypes.concourse:
      return extractConcourseLogTime(log)
    case CloudWatchLogTypes['nginx-reverse-proxy']:
    case CloudWatchLogTypes['nginx-forward-proxy']:
      return extractNginxKvLogTime(log)
    case CloudWatchLogTypes.cloudtrail:
      return extractCloudTrailLogTime(log)
  }
}
