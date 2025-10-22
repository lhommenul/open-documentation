# Stage 1: Dependencies
FROM node:22-alpine

WORKDIR /app

COPY . .

# Install dependencies
RUN npm ci

# Build the application
RUN npm run build

# Set to production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Set the host to listen on all interfaces
ENV HOST=0.0.0.0
ENV PORT=3000

# Start the application
CMD ["node", "./.output/server/index.mjs"]

