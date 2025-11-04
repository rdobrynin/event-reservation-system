FROM node:23-alpine AS base

WORKDIR /app

# Enable Corepack and install pnpm
RUN corepack enable pnpm && corepack prepare pnpm@latest --activate

# Copy only necessary files for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Build the application (if applicable)
FROM base AS build

# Copy installed dependencies from the previous stage
COPY --from=base /app/node_modules ./node_modules

# Copy application source code
COPY . /app

# Run build command (if your project requires one)
# RUN pnpm run build

# Stage 3: Production image
FROM node:23-alpine AS production

# Set working directory
WORKDIR /app

# Copy only necessary files from the build stage (e.g., built application, production dependencies)
# If you have a build step, copy the build output here
# COPY --from=build /app/dist ./dist
# If no build step, copy relevant files directly
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build /app/node_modules ./node_modules

# Expose port and define startup command
EXPOSE 9000

CMD [ "pnpm", "start" ]

