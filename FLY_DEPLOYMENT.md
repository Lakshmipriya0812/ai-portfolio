# Fly.io Deployment Guide

This guide will help you deploy your full-stack AI Portfolio application to Fly.io using either GitHub Actions (automated) or local CLI (manual).

## Deployment Methods

### Option 1: Automated Deployment via GitHub Actions (Recommended)

### Option 2: Manual Deployment via Fly.io CLI

---

## Option 1: GitHub Actions Deployment (Recommended)

### Prerequisites

1. **GitHub Account** with your repository
2. **Fly.io Account** - Sign up at https://fly.io

### Setup Steps

#### 1. Get Your Fly.io API Token

```bash
# Install Fly.io CLI (if not already installed)
curl -L https://fly.io/install.sh | sh

# Login to Fly.io
fly auth login

# Get your API token
fly auth token
```

Copy the token that's displayed.

#### 2. Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `FLY_API_TOKEN`
5. Value: Paste the token from step 1
6. Click **Add secret**

#### 3. Initialize Fly.io App (One-Time Setup)

```bash
# Navigate to your project
cd /home/lakshmipriya/Desktop/ai-portfolio

# Initialize the app (this creates the app on Fly.io)
fly launch --no-deploy

# Set your environment secrets (see Environment Variables section below)
fly secrets set NODE_ENV=production
fly secrets set AI_PROVIDER=your_provider
# ... add other secrets
```

#### 4. Push to GitHub

```bash
git add .
git commit -m "Add Fly.io deployment workflow"
git push origin main  # or master
```

The GitHub Action will automatically deploy your app on every push to `main` or `master` branch!

#### 5. Monitor Deployment

- Go to **Actions** tab in your GitHub repository
- Click on the latest workflow run to see deployment progress
- Or check Fly.io dashboard: https://fly.io/dashboard

### Workflow Features

The `.github/workflows/fly-deploy.yml` workflow:

✅ Triggers on push to `main` or `master` branch
✅ Triggers manually via **Actions** → **Run workflow**
✅ Uses remote Docker build (faster, no local Docker needed)
✅ Automatic deployment on successful build
✅ Deploys using your `Dockerfile` and `fly.toml`

### Manual Trigger

You can also trigger deployments manually:

1. Go to **Actions** tab in GitHub
2. Select **Deploy to Fly.io** workflow
3. Click **Run workflow**
4. Select branch and click **Run workflow**

---

## Option 2: Manual CLI Deployment

### Prerequisites

1. **Install Fly.io CLI**

   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Sign up/Login to Fly.io**
   ```bash
   fly auth signup  # or fly auth login
   ```

## Deployment Steps

### 1. Initialize Fly.io App (First Time Only)

```bash
# Navigate to project root
cd /home/lakshmipriya/Desktop/ai-portfolio

# Launch the app (this will use the existing fly.toml)
fly launch --no-deploy
```

When prompted:

- Choose your app name (or keep the suggested one)
- Select your preferred region (e.g., `iad` for US East)
- Don't deploy yet (we'll set secrets first)

### 2. Set Environment Variables (Required for Both Methods)

Set your environment variables as secrets in Fly.io using the CLI:

```bash
# Required secrets
fly secrets set NODE_ENV=production

# AI Provider Configuration (example for Ollama)
# fly secrets set AI_PROVIDER=ollama
# fly secrets set OLLAMA_BASE_URL=your_ollama_url
# fly secrets set OLLAMA_CHAT_MODEL=your_model
# fly secrets set OLLAMA_EMBEDDING_MODEL=your_embedding_model

# Or for OpenAI
# fly secrets set AI_PROVIDER=openai
# fly secrets set OPENAI_API_KEY=your_api_key
# fly secrets set OPENAI_CHAT_MODEL=gpt-3.5-turbo
# fly secrets set OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Or for Gemini
# fly secrets set AI_PROVIDER=gemini
# fly secrets set GEMINI_API_KEY=your_api_key

# Or for Anthropic
# fly secrets set AI_PROVIDER=anthropic
# fly secrets set ANTHROPIC_API_KEY=your_api_key

# CORS Configuration
fly secrets set ALLOWED_ORIGINS=https://your-app.fly.dev

# Rate Limiting (optional, defaults will be used if not set)
fly secrets set RATE_LIMIT_WINDOW_MS=900000
fly secrets set RATE_LIMIT_MAX_REQUESTS=100
fly secrets set RATE_LIMIT_MAX_PER_IP=20
fly secrets set RATE_LIMIT_WINDOW_MINUTES=15

# View all secrets
fly secrets list
```

### 3. Deploy the Application (CLI Only)

If using GitHub Actions, skip this step - deployment is automatic on push.

```bash
# Deploy the app manually
fly deploy

# Monitor the deployment
fly logs
```

### 4. Access Your Application

```bash
# Open your app in the browser
fly open

# Or get the URL
fly status
```

## Configuration Details

### Dockerfile Features

✅ **Multi-stage build** - Keeps final image small (~150MB)
✅ **Node 18 Alpine** - Lightweight base image
✅ **Build caching** - Faster subsequent builds
✅ **Non-root user** - Enhanced security
✅ **Health checks** - Automatic monitoring
✅ **Signal handling** - Graceful shutdowns with dumb-init
✅ **Production optimized** - Only production dependencies

### fly.toml Configuration

- **Auto-scaling**: Scales to 0 when idle (saves money)
- **Auto-start**: Starts automatically on requests
- **Health checks**: Monitors `/health` endpoint
- **HTTPS**: Automatically enforced
- **Region**: Configurable (default: `iad`)
- **Resources**: 1 CPU, 256MB RAM (adjustable)

## Useful Commands

### Monitoring

```bash
# View logs (real-time)
fly logs

# View app status
fly status

# SSH into the container
fly ssh console

# Check app configuration
fly config show
```

### Scaling

```bash
# Scale vertically (more resources)
fly scale vm shared-cpu-1x --memory 512

# Scale horizontally (more instances)
fly scale count 2

# Scale to zero when idle (default)
fly scale count 0 --max-per-region 1
```

### Updates

```bash
# Deploy new version
fly deploy

# Rollback to previous version
fly releases list
fly rollback <release-number>
```

### Secrets Management

```bash
# List all secrets
fly secrets list

# Update a secret
fly secrets set API_KEY=new_value

# Remove a secret
fly secrets unset API_KEY
```

### Database/Storage (if needed)

```bash
# Create a volume for persistent storage
fly volumes create data --size 1

# Update fly.toml to mount the volume (already included, just uncomment)
```

## Troubleshooting

### Build Fails

```bash
# Check Docker build locally
docker build -t ai-portfolio .

# Run locally to test
docker run -p 8080:8080 -e NODE_ENV=production ai-portfolio
```

### App Doesn't Start

```bash
# Check logs
fly logs

# Check health endpoint
curl https://your-app.fly.dev/health

# SSH into container
fly ssh console
cd /app/server
node src/server.js
```

### Environment Variables Not Working

```bash
# Verify secrets are set
fly secrets list

# Check runtime environment
fly ssh console
printenv
```

### CORS Issues

```bash
# Update ALLOWED_ORIGINS to include your Fly.io URL
fly secrets set ALLOWED_ORIGINS=https://your-app.fly.dev
```

## Cost Optimization

- **Auto-scaling**: App scales to 0 when idle (included in free tier)
- **Shared CPU**: Cheaper than dedicated
- **Minimal RAM**: Start with 256MB, increase if needed
- **Single region**: Deploy to one region initially

## Security Best Practices

✅ Non-root user in container
✅ Helmet.js for security headers
✅ Rate limiting enabled
✅ CORS properly configured
✅ Environment variables as secrets
✅ HTTPS enforced
✅ Health checks enabled

## Production Checklist

Before going live:

### For GitHub Actions Deployment:

- [ ] Add `FLY_API_TOKEN` to GitHub Secrets
- [ ] Run `fly launch --no-deploy` to initialize app
- [ ] Set all required environment variables via `fly secrets set`
- [ ] Configure ALLOWED_ORIGINS with your Fly.io domain
- [ ] Push to main/master branch to trigger deployment
- [ ] Monitor deployment in GitHub Actions tab
- [ ] Verify AI provider is working
- [ ] Test all API endpoints
- [ ] Check rate limiting is appropriate
- [ ] Monitor logs for errors
- [ ] Set up custom domain (optional)
- [ ] Enable monitoring/alerts (optional)

### For CLI Deployment:

- [ ] Install Fly.io CLI
- [ ] Run `fly launch` to initialize app
- [ ] Set all required environment variables
- [ ] Configure ALLOWED_ORIGINS with your domain
- [ ] Run `fly deploy` to deploy
- [ ] Test all API endpoints
- [ ] Verify AI provider is working
- [ ] Check rate limiting is appropriate
- [ ] Monitor logs for errors
- [ ] Set up custom domain (optional)
- [ ] Enable monitoring/alerts (optional)

## Custom Domain (Optional)

```bash
# Add a custom domain
fly certs add your-domain.com

# Follow the DNS instructions provided
fly certs show your-domain.com
```

## Support

- Fly.io Docs: https://fly.io/docs/
- Fly.io Community: https://community.fly.io/
- Your app dashboard: https://fly.io/dashboard

## Local Testing

Test the Docker build locally before deploying:

```bash
# Build the image
docker build -t ai-portfolio .

# Run with environment variables
docker run -p 8080:8080 \
  -e NODE_ENV=production \
  -e AI_PROVIDER=your_provider \
  -e ALLOWED_ORIGINS=http://localhost:8080 \
  ai-portfolio

# Access at http://localhost:8080
```
