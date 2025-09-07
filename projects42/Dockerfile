FROM python:3.11-slim AS builder

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*;

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --user -r requirements.txt;

FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*;

RUN groupadd -r django && useradd -r -g django django;

COPY --from=builder /root/.local /home/django/.local

WORKDIR /app

COPY . .

RUN mkdir -p /app/staticfiles /app/media

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh && \
    chown -R django:django /app;
USER django

ENV PATH=/home/django/.local/bin:$PATH

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/admin/', timeout=10)" || exit 1;

COPY entrypoint.sh .;
RUN chmod +x entrypoint.sh;

CMD ["./entrypoint.sh"]
