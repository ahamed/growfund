#!/bin/bash

PLUGINS_DIR="/var/www/html/wp-content/plugins"
PLUGIN_PATH="$PLUGINS_DIR/growfund"
POT_FILE="$PLUGIN_PATH/languages/growfund.pot"

echo "Building the Apps"
cd apps && yarn build:all && cd ..

echo "Generating POT file from PHP and JS sources..."
docker compose run --rm wpcli wp i18n make-pot \
  $PLUGIN_PATH \
  $POT_FILE \
  --slug=growfund \
  --domain=growfund \
  --include="*.php,resources/dist/*.js" \
  --exclude="node_modules,vendor,tests"

echo "POT file generated successfully: $POT_FILE"

PRO_PLUGIN_PATH="$PLUGINS_DIR/growfund-pro"
PRO_POT_FILE="$PRO_PLUGIN_PATH/languages/growfund-pro.pot"

echo "Generating POT file from PHP and JS sources..."
docker compose run --rm wpcli wp i18n make-pot \
  $PRO_PLUGIN_PATH \
  $PRO_POT_FILE \
  --slug=growfund-pro \
  --domain=growfund-pro \
  --include="*.php,resources/dist/*.js" \
  --exclude="node_modules,vendor,tests"

echo "POT file generated successfully: $PRO_POT_FILE"