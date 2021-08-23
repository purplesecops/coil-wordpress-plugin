#!/bin/bash

set -e

# ./apache2-background.sh

wp core install --url=http://php --title=wordpress --admin_user=admin --admin_password=password --admin_email=admin@example.com --skip-email  --allow-root

wp db import /var/www/html/wp-content/plugins/coil-wordpress-plugin/scripts/test-site.sql --allow-root

# wp plugin install wordpress-importer --activate  --allow-root

# wp import /var/www/html/wp-content/plugins/coil-wordpress-plugin/cypress/fixtures/coil-automation-docker.xml --authors=create  --allow-root

wp plugin activate coil-wordpress-plugin --allow-root

cd wp-content/plugins/coil-wordpress-plugin

# npx cypress run --config baseUrl="http://php"
npx cypress run --spec 'cypress/integration/frontend/excerpt.spec.js' --config baseUrl="http://php"