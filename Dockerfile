# Multi-stage Dockerfile for Next.js Development with pnpm
FROM node:20-alpine AS base

# Install pnpm and dependencies needed for node_modules
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm
WORKDIR /app

# Stage 1: Dependencies
FROM base AS deps
# Copy package files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
# Install all dependencies (including devDependencies for dev mode)
RUN pnpm install

# Stage 2: Development Runner
FROM base AS runner
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy source code
COPY . .

# Set environment variables for development
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Command to run development server
CMD ["pnpm", "dev"]
