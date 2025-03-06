# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock package-lock.json ./
RUN yarn install --production

# Copy the entire source code
COPY . .

# Compile TypeScript
RUN yarn build

# Expose the application port
EXPOSE 5000

# Command to run the app
CMD ["node", "dist/server.js"]
