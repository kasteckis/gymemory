docker compose stop
docker compose up -d --build
docker compose exec web composer install
# todo fix this
sleep 10
docker compose exec web php artisan migrate
docker compose exec web php artisan cache:clear
docker compose exec web php artisan route:clear
docker compose exec web php artisan config:clear
docker compose exec web php artisan view:clear
docker compose exec web php artisan migrate

cd frontend
yarn install
yarn build
yarn dev
