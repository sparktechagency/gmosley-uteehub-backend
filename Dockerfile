# Builder
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

# Install ALL dependencies for building (dev + prod)
RUN yarn install --frozen-lockfile

COPY . .

# Build TypeScript output
RUN yarn build

# Production image
FROM node:18-alpine

WORKDIR /app

# Install only production dependencies
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

# Copy built output
COPY --from=builder /app/dist /app/dist

EXPOSE 5007

CMD ["node", "dist/server.js"]
