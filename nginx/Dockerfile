FROM nginx:alpine

# Accept build argument for profile
ARG PROFILE=dev

# Copy the appropriate nginx configuration based on profile
COPY nginx.${PROFILE}.conf /etc/nginx/conf.d/default.conf

# Create directories for SSL certificates (for future use)
RUN mkdir -p /etc/ssl/certs /etc/ssl/private

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

EXPOSE 80 443
