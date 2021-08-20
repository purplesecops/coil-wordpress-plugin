FROM php:7-apache
 
WORKDIR /var/www/html
 
RUN docker-php-ext-install mysqli

RUN docker-php-ext-install pdo pdo_mysql
 
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar

RUN chmod +x wp-cli.phar

RUN mv wp-cli.phar /usr/local/bin/wp

RUN apt update

RUN apt install default-mysql-client -y

RUN apt install -y libzip-dev zip && docker-php-ext-install zip

RUN wp core download --skip-content --allow-root

COPY . /var/www/html/wp-content/plugins/coil-wordpress-plugin

RUN cp wp-config-sample.php wp-config.php

RUN sed -i "s/database_name_here/wordpress/" "wp-config.php"
RUN sed -i "s/username_here/admin/" "wp-config.php"
RUN sed -i "s/password_here/password/" "wp-config.php"
RUN sed -i "s/localhost/db/" "wp-config.php"

RUN bash curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash && nvm install 12 && nvm use 12

# RUN wp core install --url=http://php --title=wordpress --admin_user=admin --admin_password=password --admin_email=admin@example.com --skip-email  --allow-root

# RUN wp plugin install wordpress-importer --activate  --allow-root

# RUN wp import 'wp-content/plugins/coil-wordpress-plugin/cypress/fixtures' --authors=create  --allow-root

# RUN wp plugin activate coil-web-monetization/plugin.php --allow-root or wp plugin install coil-web-monetization --activate --allow-root

CMD ["apache2-foreground"]