#!/bin/bash

# Run in an authenticated shell for pay-dev.
npm run build

aws lambda update-function-code \
  --function-name dev-log-stream-transformation \
  --zip-file "fileb://$(ls ./dist/pay-logging-firehose-transformation-v*)"

