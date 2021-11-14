#!/bin/bash

# FILL IN THESE VALUES (refer to: <Blog>)
# Do NOT commit this file!
ACCOUNT_ID=''
ACCOUNT_TOKEN=''
PAGES_FUNCTIONS_NAME=''

if [ $# -ne 2 ]; then
  echo 'Usage: set_secret <name> <value>'
  exit 1
fi

# Validate the values have been set
if [ "$ACCOUNT_ID" == '' ]; then
  echo 'ACCOUNT_ID is not set'
  exit 1
elif [ "$ACCOUNT_TOKEN" == '' ]; then
  echo 'ACCOUNT_TOKEN is not set'
  exit 1
elif [ "$PAGES_FUNCTIONS_NAME" == '' ]; then
  echo 'PAGES_FUNCTIONS_NAME is not set'
  exit 1
fi

curl -X PUT \
  -H "Authorization: $ACCOUNT_TOKEN" \
  -H 'Content-Type: application/json' \
  -d "{\"name\": \"$1\", \"text\": \"$2\", \"secret_type\": \"secret_text\"}" \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/scripts/$PAGES_FUNCTIONS_NAME/secrets"