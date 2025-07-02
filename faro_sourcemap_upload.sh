#!/bin/bash
# load environment variables (from .env.local or legacy file)
if [ -f .env.local ]; then
  source .env.local
elif [ -f .env.RANDOM_PICTURE_FRONTEND ]; then
  source .env.RANDOM_PICTURE_FRONTEND
fi

# ensure FARO_API_KEY is set
if [ -z "$FARO_API_KEY" ]; then
  echo "FARO_API_KEY not set; skipping source map upload"
  exit 0
fi

npx faro-cli upload \
  --endpoint "https://faro-api-prod-us-east-2.grafana.net/faro/api/v1" \
  --app-id "414" \
  --api-key "$FARO_API_KEY" \
  --stack-id "1273903" \
  --output-path "./build/static/js" \
  --bundle-id "$FARO_BUNDLE_ID_RANDOM_PICTURE_FRONTEND" \
  --verbose