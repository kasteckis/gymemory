docker compose stop
docker compose up -d --build
docker compose exec web composer install

docker compose exec web cp .env.example .env
docker compose exec web php artisan optimize:clear
docker compose exec web chmod -R 777 ./storage/

while true # TODO: Think of a better solution, because this feels wrong.
do
    docker compose exec web php artisan migrate --force

    if [ $? -eq 0 ]; then
        echo "Migration succeeded."
        break
    fi

    echo "Migration failed. Retrying..."
    sleep 5
done

cd frontend
yarn install
yarn build
yarn dev
