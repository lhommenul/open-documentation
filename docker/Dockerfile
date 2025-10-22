# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production=false

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Copy built application from builder
COPY --from=builder /app/.output ./

# Expose port
EXPOSE 3000

# Set the host to listen on all interfaces
ENV HOST=0.0.0.0
ENV PORT=3000

# Start the application
CMD ["node", "server/index.mjs"]

