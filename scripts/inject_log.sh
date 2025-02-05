#!/bin/bash

# Run in an authenticated shell. This will send the contents of the logs.txt
# to the pay-dev-trial log group in the pay-dev account.
aws logs put-log-events \
  --log-group-name dev-1_app_trial-pipeline \
  --log-stream-name dummy-data \
  --log-events timestamp=$(date +%s000),message=\""$(cat logs.txt)"\"

