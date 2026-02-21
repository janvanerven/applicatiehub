# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Native module build deps (required for better-sqlite3)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

# ---- Production stage ----
FROM node:20-alpine AS runner
WORKDIR /app

# Runtime shared libs needed by the compiled better-sqlite3 binary
RUN apk add --no-cache libgcc libstdc++

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Ensure volume mount points exist with correct ownership
RUN mkdir -p /app/data /app/uploads

EXPOSE 3000

ENV NODE_ENV=production
# Allow up to 10 MB request bodies (image uploads)
ENV BODY_SIZE_LIMIT=10485760

CMD ["node", "build"]
