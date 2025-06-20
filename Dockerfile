# Step 1: Install dependencies and build the app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock/pnpm-lock.yaml)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# Step 2: Create a lightweight production image
FROM node:18-alpine AS runner

# Set NODE_ENV to production
ENV NODE_ENV=production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built assets from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/package.json ./package.json

# (Optional) If you have a middleware or custom server, copy those too
# COPY --from=builder /app/server.js ./server.js

# Set port (adjust if needed)
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
