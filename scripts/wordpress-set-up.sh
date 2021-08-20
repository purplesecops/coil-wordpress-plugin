#!/bin/bash

set -e

apt update

apt install default-mysql-client

apt install -y libzip-dev zip && docker-php-ext-install zip

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

wp core download --skip-content --allow-root

cp wp-config-sample.php wp-config.php

sed -i "s/database_name_here/wordpress/" "wp-config.php"
sed -i "s/username_here/admin/" "wp-config.php"
sed -i "s/password_here/password/" "wp-config.php"
sed -i "s/localhost/db/" "wp-config.php"

wp core install --url=http://php --title=wordpress --admin_user=admin --admin_password=password --admin_email=admin@example.com --skip-email  --allow-root

wp plugin install wordpress-importer --activate  --allow-root

wp import /var/www/html/wp-config/plugins/coil-wordpress-plugin/cypress/fixtures/coil-automation.xml --authors=create  --allow-root

# wp plugin activate /var/www/html/wp-config/plugins/coil-wordpress-plugin/plugin.php --allow-root