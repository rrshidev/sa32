# Команды для обновления приложения на сервере 104.128.132.83
# Выполнять в папке /opt/sa32/

# 1. Подключиться к серверу:
# ssh root@104.128.132.83

# 2. Перейти в папку проекта:
# cd /opt/sa32/

# 3. Остановить контейнеры:
docker-compose down

# 4. Скачать изменения:
git pull origin main

# 5. Собрать образы:
docker-compose build --no-cache

# 6. Применить миграции (важно!):
docker-compose run --rm backend npm run migration:run

# 7. Запустить приложение:
docker-compose up -d

# 8. Проверить статус:
docker-compose ps
docker-compose logs -f backend

# Если есть проблемы с миграциями, можно сбросить БД:
# docker-compose down -v
# docker-compose up -d
# docker-compose exec backend npm run migration:run
