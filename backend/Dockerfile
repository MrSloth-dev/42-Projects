FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN groupadd -r django && useradd -r -g django django

WORKDIR /app

# Pure-Python dependencies only: SQLite ships with the interpreter, so there is
# no libpq to build or link.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/data /app/staticfiles /app/media \
    && chmod +x entrypoint.sh \
    && chown -R django:django /app

USER django

EXPOSE 8000

CMD ["./entrypoint.sh"]
