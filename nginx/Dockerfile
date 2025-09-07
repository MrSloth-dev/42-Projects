FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create directories for SSL certificates (for future use)
RUN mkdir -p /etc/ssl/certs /etc/ssl/private

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

EXPOSE 80 443
