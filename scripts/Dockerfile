FROM php:7-apache

WORKDIR /var/www/html
 
RUN docker-php-ext-install mysqli

RUN docker-php-ext-install pdo pdo_mysql

# Installing wp-cli
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
RUN chmod +x wp-cli.phar
RUN mv wp-cli.phar /usr/local/bin/wp

# Installing mysql-client
RUN apt update
RUN apt install default-mysql-client -y

# Downloading wordPress core, which requires ZipArchive and copying in the plugin code
RUN apt install -y libzip-dev zip && docker-php-ext-install zip
RUN wp core download --allow-root
COPY . /var/www/html/wp-content/plugins/coil-wordpress-plugin
RUN ls
RUN cd /var/www/html/wp-content
RUN ls
RUN cd /var/www/html/wp-content/plugins
RUN ls
RUN cd /var/www/html/wp-content/plugins/coil-wordpress-plugin
RUN ls
RUN cd /var/www/html