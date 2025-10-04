FROM node:20-alpine AS builder

WORKDIR /app

# Accept build argument
ARG VITE_API_BASE_URL=http://localhost:8000

# Set as environment variable for build process
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Debug: Show environment variables (optional)
RUN echo "Building with VITE_API_BASE_URL=${VITE_API_BASE_URL}"

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
