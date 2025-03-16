FROM node:18-alpine as build

WORKDIR /app

# Set ARGs for build configuration
ARG VITE_API_URL=http://localhost:5002

# Set environment variables for build process
ENV VITE_API_URL=$VITE_API_URL

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# Create a .env file with the API URL
RUN echo "VITE_API_URL=$VITE_API_URL" > .env

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add a simple health check for the frontend
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]