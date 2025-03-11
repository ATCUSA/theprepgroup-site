FROM node:20-alpine AS builder

WORKDIR /app

# Install bun for faster builds
RUN npm install -g bun

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
# Note: DATABASE_URL should be passed at build time if needed for SSR
ARG DATABASE_URL
RUN bun run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/.svelte-kit/output/server ./server
COPY --from=builder /app/.svelte-kit/output/client ./client
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Create a script to start the application with environment variables
RUN echo '#!/bin/sh\n\
exec node -r dotenv/config server' > /app/start.sh && \
    chmod +x /app/start.sh

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["/app/start.sh"]
