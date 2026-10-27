#!/bin/bash
set -e

# SQLite lives on a volume shared with this container; make sure it exists.
DB_DIR="${DB_DIR:-/app/data}"
mkdir -p "$DB_DIR"
echo "Database directory: $DB_DIR"
ls -la "$DB_DIR"

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
    # SQLite allows a single writer; two workers give headroom for the read-heavy
    # API without piling up write contention.
    exec gunicorn wsgi:application \
        --bind 0.0.0.0:8000 \
        --workers 2 \
        --timeout 120 \
        --keep-alive 2 \
        --max-requests 1000 \
        --max-requests-jitter 100
fi
