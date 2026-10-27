#!/bin/sh
set -e

# Resolve the container DNS server at startup. Docker uses 127.0.0.11,
# Podman uses the network gateway (e.g. 10.89.0.1); read whichever is real.
if [ -z "${NGINX_RESOLVER:-}" ]; then
    NGINX_RESOLVER="$(awk '/^nameserver/ { print $2; exit }' /etc/resolv.conf)"
fi

if [ -z "${NGINX_RESOLVER:-}" ]; then
    echo "ERROR: could not determine a DNS resolver from /etc/resolv.conf" >&2
    exit 1
fi

export NGINX_RESOLVER

envsubst '${NGINX_RESOLVER}' \
    < /etc/nginx/templates/default.conf.template \
    > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
