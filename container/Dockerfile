# NanoClaw Agent Container
# Runs Claude Agent SDK in isolated Linux VM with browser automation

FROM oven/bun:1.3.11-slim

# Install system dependencies for Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    fonts-noto-cjk \
    fonts-noto-color-emoji \
    libgbm1 \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libcups2 \
    libdrm2 \
    libxshmfence1 \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set Chromium path for agent-browser
ENV AGENT_BROWSER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium
ENV PATH=/home/node/.bun/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# Set ownership to node user (non-root) for writable directories
RUN useradd -m -u 1000 -s /bin/bash node \
    && mkdir -p /workspace/group /workspace/global /workspace/extra /workspace/ipc/messages /workspace/ipc/tasks /workspace/ipc/input \
    && chown -R node:node /workspace /home/node

# Create app directory and copy package files first for better caching
WORKDIR /app
RUN mkdir -p /app && chown -R node:node /app
COPY --chown=node:node agent-runner/package.json agent-runner/bun.lock ./

# Install agent-browser and claude-code globally with Bun
USER node
RUN bun add -g agent-browser @anthropic-ai/claude-code

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY --chown=node:node agent-runner/ ./

# Build TypeScript with Bun tooling
RUN bun run build

# Set working directory to group workspace
WORKDIR /workspace/group

# Entry point reads JSON from stdin, outputs JSON to stdout
ENTRYPOINT ["bun", "/app/dist/index.js"]
