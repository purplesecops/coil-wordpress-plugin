FROM php:7-apache

WORKDIR /var/www/html
 
RUN docker-php-ext-install mysqli

RUN docker-php-ext-install pdo pdo_mysql

COPY . .

# Adjusting the wp-config.php, vars.php, and htaccess files appropriately for the context
RUN cp wp-config-sample.php wp-config.php
RUN sed -i "s/database_name_here/wordpress/" "wp-config.php"
RUN sed -i "s/username_here/admin/" "wp-config.php"
RUN sed -i "s/password_here/password/" "wp-config.php"
RUN sed -i "s/localhost/db/" "wp-config.php"
RUN mv /var/www/html/wp-content/plugins/coil-wordpress-plugin/scripts/vars.php /var/www/html/wp-includes/
RUN mv /var/www/html/wp-content/plugins/coil-wordpress-plugin/scripts/.htaccess /var/www/html/

# Creating a node user
RUN groupadd --gid 1000 node && useradd --uid 1000 --gid node -G sudo --shell /bin/bash --create-home node
RUN echo "\nnode ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
RUN chown -R node:node /var/www/html
USER node

#Installing nvm and Cypress
RUN curl -o install.sh https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh
# Setting the shell to bash to make sure the nvm scripts work correctly
SHELL ["/bin/bash", "-c"]
RUN bash install.sh
# Loads the environmental variables needed for nvm and installs Cypress directly from the executable becasue there 
RUN source ~/.nvm/nvm.sh && nvm install 12 && nvm use 12 && nvm install-latest-npm && npm install cypress