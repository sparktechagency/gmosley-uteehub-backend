# Use an official Node.js runtime as the base image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./

# Clean npm cache and install production dependencies
RUN npm cache clean --force
RUN yarn install --production --frozen-lockfile

# Copy only necessary source files for building
COPY . .

# Compile TypeScript (build only necessary files)
RUN yarn build

# Second stage: smaller runtime image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the build output from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 5000

CMD ["node", "dist/server.js"]
