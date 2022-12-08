#!/bin/bash

cd /var/www/gymemory.kasteckis.lt

git checkout --
git pull

cd backend
composer install --optimize-autoloader --no-dev
php artisan cache:clear
php artisan route:clear
php artisan config:clear
php artisan view:clear
php artisan migrate
