FROM php:8.3-fpm-alpine

RUN docker-php-ext-install pdo pdo_mysql \
    && apk add --no-cache mariadb-client

COPY docker/php/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /var/www/html

EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]
