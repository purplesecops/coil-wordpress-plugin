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

# Adjusting the wp-config.php, vars.php, and htaccess files appropriately for the context
RUN cp wp-config-sample.php wp-config.php
RUN sed -i "s/database_name_here/wordpress/" "wp-config.php"
RUN sed -i "s/username_here/admin/" "wp-config.php"
RUN sed -i "s/password_here/password/" "wp-config.php"
RUN sed -i "s/localhost/db/" "wp-config.php"
RUN mv /var/www/html/wp-content/plugins/coil-wordpress-plugin/scripts/vars.php /var/www/html/wp-includes
RUN mv /var/www/html/wp-content/plugins/coil-wordpress-plugin/scripts/.htaccess /var/www/html/

# Installing nvm to install Cypress as well as its dependencies
RUN apt install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb -y
RUN curl -o install.sh https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh
# Setting the shell to bash to make sure the nvm scripts work correctly
SHELL ["/bin/bash", "-c"]
RUN bash install.sh
RUN chmod -R 777 ~
# Loads the environmental variables needed for nvm and installs Cypress directly from the executable becasue there 
RUN source ~/.nvm/nvm.sh \
&& nvm install 12 \
&& nvm use 12 \
&& nvm install-latest-npm \
&& cd /var/www/html/wp-content/plugins/coil-wordpress-plugin \
&& ./node_modules/.bin/cypress install
RUN chmod -R 777 ~

ENTRYPOINT ["sleep", "10000"]

# ENTRYPOINT ["/bin/bash", "/var/www/html/wp-content/plugins/coil-wordpress-plugin/scripts/wordpress-set-up.sh"]