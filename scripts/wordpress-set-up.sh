#!/bin/bash

set -e

a2enmod rewrite

bash /var/www/html/wp-content/plugins/coil-wordpress-plugin/scripts/apache2-background.sh

wp core install --url=http://db --title=wordpress --admin_user=admin --admin_password=password --admin_email=admin@example.com --skip-email  --allow-root

wp plugin install wordpress-importer --activate  --allow-root

wp import /var/www/html/wp-content/plugins/coil-wordpress-plugin/tests/cypress/fixtures/coil-automation-docker.xml --authors=create  --allow-root

wp plugin activate coil-wordpress-plugin --allow-root

cd wp-content/plugins/coil-wordpress-plugin

npx cypress run --project ./tests --config baseUrl="http://php"
