#!/bin/bash

cd /var/www/api.gymemory.kasteckis.lt

git checkout --
git pull

cd backend
composer install --no-dev
