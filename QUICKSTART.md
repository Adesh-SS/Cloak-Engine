# CloakScan - Quick Start Guide

**Get started with CloakScan in under 2 minutes!**

CloakScan is a privacy-first, open-source security scanning and AI code review CLI. All static analysis features work **100% free and offline** - no API keys required!

---

## 📦 Installation

```bash
# Install CloakScan globally
npm install -g cloakscan

# Verify installation
cloakscan --version
```

**Requirements:**

- Node.js >= 18.0.0
- npm or yarn

---

## 🚀 Quick Start (3 Steps)

### Step 1: Initialize CloakScan

```bash
cloakscan init
```

This creates a local configuration file and generates a client ID for optional telemetry.

### Step 2: Run Your First Security Scan

```bash
# Scan your current project (100% FREE, works offline)
cloakscan security
```

This will:

- ✅ Detect secrets in your code (API keys, passwords, tokens)
- ✅ Scan dependencies for known vulnerabilities
- ✅ Check Dockerfiles for security issues
- ✅ Analyze Infrastructure as Code (Terraform, CloudFormation, K8s)
- ✅ Detect OWASP Top 10 vulnerabilities
- ✅ Generate a comprehensive markdown report

**No API key needed** - all security scanning works completely offline!

### Step 3: (Optional) Configure AI Provider

For AI-powered features like code review, documentation generation, and refactoring:

```bash
cloakscan config
```

Follow the prompts to set:

- AI provider (OpenAI, Anthropic Claude, Google Gemini, or Ollama for local AI)
- API key (your own key - we never see it)
- Telemetry preference

**Note:** AI features are optional. All security scanning works without any API keys!

---

## 📋 Available Commands

CloakScan provides **21 commands** organized by category:

### Setup & Configuration

```bash
cloakscan init                    # Initialize CloakScan (generates client_id for telemetry)
cloakscan config                  # Configure AI provider and settings (OpenAI, Claude, Gemini, Ollama)
cloakscan status                  # Show current status (credits, provider, repo info)
cloakscan reset                   # Clear local cache and config
```

### Security & Scanning (Offline-Capable, 100% FREE)

```bash
cloakscan security                # Security vulnerability scanning
cloakscan scan                    # Comprehensive scan (all security and quality checks)
cloakscan test                    # Run tests and code quality analysis
cloakscan sbom                    # Generate Software Bill of Materials (SBOM)
cloakscan rules                   # Run custom YAML-based rules engine
```

### Testing & Performance

```bash
cloakscan perf                    # Performance testing (load, stress, Lighthouse)
cloakscan mutation                # Mutation testing to assess test quality
```

### AI-Powered Code Review (Requires API Key)

```bash
cloakscan run                     # AI-enhanced code review
cloakscan review                  # AI-powered code review for git changes
```

### AI-Powered Code Generation (Requires API Key)

```bash
cloakscan commit                  # Generate AI-powered commit messages
cloakscan explain <target>        # Explain code using AI (function, class, file)
cloakscan test-gen                # Generate tests using AI
cloakscan docs                    # Generate documentation using AI
```

### AI-Powered Code Improvement (Requires API Key)

```bash
cloakscan refactor                # AI-powered refactoring suggestions
cloakscan threat-model            # AI-powered threat modeling with STRIDE analysis
cloakscan migrate                 # AI-powered code migration assistant
```

### Interactive AI (Requires API Key)

```bash
cloakscan chat                    # Interactive AI chat about your codebase (RAG feature)
```

---

## 💡 Common Use Cases

### Security Audit Before Deployment

```bash
# Run comprehensive security scan
cloakscan security

# Check for dependency vulnerabilities
cloakscan security --licenses

# Generate SBOM for compliance
cloakscan sbom --format spdx
```

### AI-Powered Code Review

```bash
# Review all changes in your git repository
cloakscan review

# Review specific file
cloakscan review --file src/api.ts

# Get AI suggestions for security issues
cloakscan security --ai-fix
```

### Code Quality & Testing

```bash
# Run all quality checks
cloakscan test --all

# Performance testing
cloakscan perf --load --duration 1m

# Mutation testing
cloakscan mutation --threshold 80
```

### AI Code Assistance

```bash
# Explain a function
cloakscan explain getUserData --type function

# Generate tests
cloakscan test-gen --function calculateTotal

# Generate documentation
cloakscan docs --type api

# Interactive chat about your codebase
cloakscan chat
```

---

## 🔒 Privacy & Security

### What CloakScan Does

- ✅ Scans your code **locally** on your machine
- ✅ Never uploads source code to any server
- ✅ Works **completely offline** for static analysis
- ✅ Uses your own AI API keys (BYOK - Bring Your Own Key)

### What CloakScan Sends (Optional Telemetry)

- Client ID (anonymous identifier)
- Repository ID (hashed, anonymous)
- Lines of code count
- Command usage statistics

**You can disable telemetry:**

```bash
cloakscan --no-telemetry security
```

---

## 🎯 How It Works

### Offline-First Architecture

**Static Analysis** (Works completely offline, 100% FREE):

- Secrets detection (20+ patterns)
- Dependency vulnerability scanning
- Code metrics and complexity analysis
- LOC counting (20+ languages)
- OWASP Top 10 detection
- Docker security scanning
- Infrastructure as Code analysis

**AI-Enhanced** (Optional, requires your API key):

- OpenAI GPT-4, GPT-3.5
- Anthropic Claude (Opus, Sonnet, Haiku)
- Google Gemini
- Ollama (local/offline AI)
- LM Studio (local AI)

---

## 🆘 Troubleshooting

### Command Not Found

```bash
# Check if CloakScan is installed
npm list -g cloakscan

# If not installed, install it
npm install -g cloakscan

# Verify it's in your PATH
which cloakscan
```

### Permission Errors (macOS/Linux)

```bash
# Use sudo if needed (not recommended)
sudo npm install -g cloakscan

# Better: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g cloakscan
```

### AI Features Not Working

```bash
# Check your configuration
cloakscan status

# Reconfigure AI provider
cloakscan config

# Verify API key is set correctly
cloakscan config --show
```

### Clear Cache and Start Fresh

```bash
# Reset all local data
cloakscan reset --all

# Re-initialize
cloakscan init
```

---

## 📚 Documentation

- **[README.md](README.md)** - Complete project overview
- **[CLI README](cli/README.md)** - Detailed CLI documentation
- **[Getting Started](docs/GETTING_STARTED.md)** - Extended getting started guide
- **[Docker Guide](docs/DOCKER_GUIDE.md)** - Running CloakScan in Docker
- **[Language Support](docs/LANGUAGE_PARSERS.md)** - Supported languages and parsers

---

## 🆘 Getting Help

- **GitHub Issues**: <https://github.com/SDhinakar/Cloak-Engine/issues>
- **Documentation**: Check the `docs/` directory
- **Examples**: See `examples/` directory (if available)

---

## ✅ Next Steps

1. ✅ **Install**: `npm install -g cloakscan`
2. ✅ **Initialize**: `cloakscan init`
3. ✅ **Scan**: `cloakscan security` (works offline, 100% free!)
4. ✅ **Configure AI** (optional): `cloakscan config`
5. ✅ **Explore**: Try `cloakscan --help` to see all commands

**That's it! You're ready to start scanning your code for security issues.**

---
