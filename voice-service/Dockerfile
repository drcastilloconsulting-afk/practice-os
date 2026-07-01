# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files and install production deps only
COPY package*.json ./
RUN npm ci --omit=dev

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy installed modules and source
COPY --from=deps /app/node_modules ./node_modules
COPY server.js ./
COPY package.json ./

# Railway injects PORT automatically; default to 8080 for local runs
ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
