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
FROM oven/bun:1-alpine AS production

WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/build ./
COPY --from=builder /app/package.json ./

# Install only production dependencies with Bun
RUN bun install --production

# Expose the port the app will run on
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application with Bun
CMD ["bun", "index.js"]
