#!/bin/bash
set -e

# Wait for database to be ready
echo "Waiting for database..."
while ! python -c "
import os
import django
from django.conf import settings
from django.db import connections
from django.core.exceptions import ImproperlyConfigured

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

try:
    connections['default'].cursor()
    print('Database available!')
except Exception as e:
    print(f'Database not ready: {e}')
    exit(1)
"; do
    echo "Database is unavailable - sleeping"
    sleep 1
done

echo "Database is up - executing command"

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

if [ "$DJANGO_SUPERUSER_USERNAME" ] && [ "$DJANGO_SUPERUSER_EMAIL" ] && [ "$DJANGO_SUPERUSER_PASSWORD" ]; then
# Create superuser if it doesn't exist (optional)
    echo "Creating superuser..."
    python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists():
    User.objects.create_superuser('$DJANGO_SUPERUSER_USERNAME', '$DJANGO_SUPERUSER_EMAIL', '$DJANGO_SUPERUSER_PASSWORD')
    print('Superuser created successfully')
else:
    print('Superuser already exists')
"
fi

# Determine command based on environment
if [ "$DJANGO_ENV" = "development" ]; then
    echo "Starting Django development server..."
    exec python manage.py runserver 0.0.0.0:8000
else
    echo "Starting Gunicorn production server..."
    exec gunicorn backend.wsgi:application \
        --bind 0.0.0.0:8000 \
        --workers 3 \
        --timeout 120 \
        --keep-alive 2 \
        --max-requests 1000 \
        --max-requests-jitter 100
fi
