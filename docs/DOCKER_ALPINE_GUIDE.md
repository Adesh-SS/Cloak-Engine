# Docker & Alpine Linux Guide

> ⚠️ **Note:** This guide has been integrated into the [Comprehensive Docker Guide](../docs/DOCKER_GUIDE.md). This document is kept as a quick reference for Alpine Linux-specific information. For complete Docker documentation covering all operating systems, see the [Comprehensive Docker Guide](../docs/DOCKER_GUIDE.md).

This guide helps you use CloakScan in Docker containers, especially Alpine Linux environments.

## Quick Start

### Alpine Linux Setup

```bash
# Install dependencies first
apk add --no-cache python3 make g++ pkgconfig cairo-dev pango-dev \
  libjpeg-turbo-dev giflib-dev pixman-dev freetype-dev build-base git

# Install CloakScan
npm install -g cloakscan

# Initialize
cloakscan init
```

## Common Issues & Solutions

### Issue #1: "Configuration not found" Error

**Symptoms:**

```
Configuration not found. Run "cloakscan init" first.
```

**Cause:** Alpine Linux containers may have issues with home directory detection.

**Solutions:**

1. **Set CLOAKSCAN_HOME environment variable:**

   ```bash
   export CLOAKSCAN_HOME=/tmp/cloakscan
   cloakscan init
   ```

2. **Ensure HOME is set:**

   ```bash
   export HOME=/root  # or appropriate directory
   cloakscan init
   ```

3. **Enable debug mode to see what's happening:**

   ```bash
   export CLOAKSCAN_DEBUG=true
   cloakscan init
   ```

### Issue #2: Permission Denied Errors

**Cause:** Container may have restricted write permissions.

**Solution:** Use `/tmp` or a writeable volume:

```bash
export CLOAKSCAN_HOME=/tmp/cloakscan
# or mount a volume
docker run -v /path/on/host:/cloakscan node:lts-alpine
export CLOAKSCAN_HOME=/cloakscan
```

### Issue #3: Missing Dependencies

**Cause:** Alpine uses `musl` instead of `glibc` and needs additional build tools.

**Solution:** Install all required dependencies:

```bash
apk add --no-cache \
  python3 \
  make \
  g++ \
  pkgconfig \
  cairo-dev \
  pango-dev \
  libjpeg-turbo-dev \
  giflib-dev \
  pixman-dev \
  freetype-dev \
  build-base \
  git
```

## Environment Variables

### CLOAKSCAN_HOME

Override the default home directory location.

```bash
export CLOAKSCAN_HOME=/custom/path
```

**Default behavior:**

- Tries `$CLOAKSCAN_HOME` first
- Falls back to `$HOME`
- Falls back to `$USERPROFILE` (Windows)
- Falls back to `os.homedir()`
- Last resort: `/tmp`

### CLOAKSCAN_DEBUG

Enable verbose debug logging to troubleshoot issues.

```bash
export CLOAKSCAN_DEBUG=true
cloakscan init  # Will show detailed logging
```

## Docker Examples

### Example 1: Basic Alpine Container

```dockerfile
FROM node:lts-alpine

# Install dependencies
RUN apk add --no-cache \
    python3 make g++ pkgconfig cairo-dev pango-dev \
    libjpeg-turbo-dev giflib-dev pixman-dev freetype-dev build-base git

# Install CloakScan
RUN npm install -g cloakscan

# Set up config location
ENV CLOAKSCAN_HOME=/app/.cloakscan

# Your code
WORKDIR /app
COPY . .

# Run CloakScan
RUN cloakscan init
```

### Example 2: With Docker Compose

```yaml
version: '3.8'
services:
  cloakscan:
    image: node:lts-alpine
    environment:
      - CLOAKSCAN_HOME=/workspace/.cloakscan
      - CLOAKSCAN_DEBUG=false
    volumes:
      - ./:/workspace
    working_dir: /workspace
    command: sh -c "
      apk add --no-cache python3 make g++ pkgconfig cairo-dev pango-dev 
      libjpeg-turbo-dev giflib-dev pixman-dev freetype-dev build-base git &&
      npm install -g cloakscan &&
      cloakscan scan
    "
```

### Example 3: CI/CD Pipeline (GitHub Actions)

```yaml
name: CloakScan Security Check
on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    container:
      image: node:lts-alpine
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: |
          apk add --no-cache python3 make g++ pkgconfig cairo-dev pango-dev \
            libjpeg-turbo-dev giflib-dev pixman-dev freetype-dev build-base git
      
      - name: Install CloakScan
        run: npm install -g cloakscan
      
      - name: Run security scan
        env:
          CLOAKSCAN_HOME: ${{ github.workspace }}/.cloakscan
        run: cloakscan security
```

### Example 4: Read-Only Root Filesystem

For enhanced security with read-only root:

```bash
docker run --read-only --tmpfs /tmp \
  -e CLOAKSCAN_HOME=/tmp/cloakscan \
  node:lts-alpine \
  sh -c "npm install -g cloakscan && cloakscan init"
```

## Testing Your Setup

Run the test script to verify CloakScan works in your environment:

```bash
cd cli
./test-alpine.sh
```

This will test:

- ✅ Clean Alpine environment
- ✅ Missing HOME variable
- ✅ Custom CLOAKSCAN_HOME
- ✅ Read-only filesystems
- ✅ Version check behavior
- ✅ Multiple commands in sequence

## Troubleshooting Checklist

If CloakScan isn't working in your container:

- [ ] Are all dependencies installed?
- [ ] Is `$HOME` or `$CLOAKSCAN_HOME` set?
- [ ] Is the target directory writable?
- [ ] Did you run with `CLOAKSCAN_DEBUG=true`?
- [ ] Are you using `node:lts-alpine` or compatible image?
- [ ] Did you run `npm install -g cloakscan` successfully?

## Getting Help

If you're still experiencing issues:

1. **Enable debug mode:**

   ```bash
   CLOAKSCAN_DEBUG=true cloakscan init 2>&1 | tee debug.log
   ```

2. **Check home directory:**

   ```bash
   node -e "console.log(require('os').homedir())"
   ```

3. **Verify write permissions:**

   ```bash
   mkdir -p ~/.cloakscan && echo "test" > ~/.cloakscan/test.txt
   ```

4. **Open an issue:** [GitHub Issues](https://github.com/SDhinakar/Cloak-Engine/issues)
   - Include the debug log
   - Mention your Docker image
   - Include your Dockerfile if relevant

## Additional Resources

- [Main README](../README.md)
- [Getting Started Guide](../docs/GETTING_STARTED.md)
- [Issue #25 - Alpine Linux Fix](https://github.com/SDhinakar/Cloak-Engine/issues/25)
