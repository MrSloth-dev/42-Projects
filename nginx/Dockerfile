FROM nginx:alpine

# Config is a template: entrypoint.sh fills in the runtime DNS resolver.
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh \
    && mkdir -p /etc/ssl/certs /etc/ssl/private \
    && rm -rf /usr/share/nginx/html/*

EXPOSE 80 443

CMD ["/entrypoint.sh"]
