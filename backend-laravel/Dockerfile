FROM php:8.4-cli

WORKDIR /backend-laravel

# Cài các package cần thiết
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

# Cài Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy file Composer của Laravel
COPY composer.json composer.lock ./

# Install Laravel dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Copy source code Laravel
COPY . .

EXPOSE 8000

ENV ADDRESS=0.0.0.0

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]