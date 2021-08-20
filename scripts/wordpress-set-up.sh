#!/bin/bash

set -e

wp core install --url=http://php --title=wordpress --admin_user=admin --admin_password=password --admin_email=admin@example.com --skip-email  --allow-root

wp plugin install wordpress-importer --activate  --allow-root

wp import /var/www/html/wp-config/plugins/coil-wordpress-plugin/cypress/fixtures/coil-automation.xml --authors=create  --allow-root

wp plugin activate /var/www/html/wp-config/plugins/coil-wordpress-plugin --allow-root