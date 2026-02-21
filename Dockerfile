# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Native module build deps (required for better-sqlite3)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
# Use npm install (not npm ci) so npm resolves the correct platform-specific
# optional binaries (e.g. @tailwindcss/oxide-linux-x64-musl) even when the
# lock file was generated on a different OS (Windows / macOS).
RUN npm install --no-audit

COPY . .
# SvelteKit's post-build analyser imports the server bundle, which executes
# db/index.ts and opens the SQLite database. The data dir must exist first.
RUN mkdir -p /app/data /app/uploads
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
