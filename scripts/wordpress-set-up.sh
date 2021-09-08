#!/bin/bash

set -e

# Issues with the database taking too long to start
sleep 10

sudo a2enmod rewrite

sudo bash /var/www/html/wp-content/plugins/coil-wordpress-plugin/scripts/apache2-background.sh

wp core install --url="http://127.0.0.1" --title=wordpress --admin_user=admin --admin_password=password --admin_email=admin@example.com --skip-email  --allow-root

wp plugin install wordpress-importer --activate  --allow-root

wp plugin activate coil-wordpress-plugin --allow-root

cd wp-content/plugins/coil-wordpress-plugin

source ~/.nvm/nvm.sh && npx cypress run --project ./tests --config baseUrl="http://127.0.0.1"
