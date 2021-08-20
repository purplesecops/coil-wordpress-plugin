#!/bin/bash

set -e

apt install default-mysql-client

# wp config create --dbname=wordpress --dbuser=admin --dbhost=db --allow-root

cp wp-config-sample.php wp-config.php

sed -i "s/database_name_here/wordpress/" "wp-config.php"
sed -i "s/username_here/admin/" "wp-config.php"
sed -i "s/password_here/password/" "wp-config.php"
sed -i "s/localhost/db/" "wp-config.php"

wp core install --url=http://php --title=wordpress --admin_user=admin --admin_password=password --admin_email=admin@example.com --skip-email  --allow-root

wp plugin install wordpress-importer --activate  --allow-root

wp import /var/www/html/wp-config/plugins/coil-wordpress-plugin/cypress/fixtures --authors=create  --allow-root

# wp plugin activate /var/www/html/wp-config/plugins/coil-wordpress-plugin/plugin.php --allow-root