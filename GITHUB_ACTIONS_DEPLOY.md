# GitHub Actions Deployment - Quick Start

## 🚀 Setup (One-Time)

### 1. Get Fly.io API Token

```bash
fly auth login
fly auth token
```

### 2. Add to GitHub Secrets

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `FLY_API_TOKEN`
4. Paste your token
5. Click **Add secret**

### 3. Initialize Fly.io App

```bash
cd /home/lakshmipriya/Desktop/ai-portfolio
fly launch --no-deploy
```

### 4. Set Environment Variables

```bash
fly secrets set NODE_ENV=production
fly secrets set AI_PROVIDER=your_provider
fly secrets set ALLOWED_ORIGINS=https://your-app.fly.dev

# Add other secrets as needed (see FLY_DEPLOYMENT.md)
```

### 5. Push to GitHub

```bash
git add .
git commit -m "Setup Fly.io deployment"
git push origin main
```

✅ **Done!** Your app will auto-deploy on every push to `main` or `master`.

---

## 📝 Usage

### Automatic Deployment

Every push to `main` or `master` automatically deploys:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Manual Deployment

Trigger deployment without pushing code:

1. Go to **Actions** tab in GitHub
2. Click **Deploy to Fly.io**
3. Click **Run workflow** → Select branch → **Run workflow**

### Monitor Deployment

- **GitHub**: Actions tab → Click latest workflow run
- **Fly.io**: https://fly.io/dashboard
- **Logs**: `fly logs` (via CLI)

---

## 🔧 Workflow Configuration

File: `.github/workflows/fly-deploy.yml`

```yaml
on:
  push:
    branches: [main, master] # Auto-deploy on push
  workflow_dispatch: # Manual trigger button
```

### Customize Workflow

**Deploy on specific branches:**

```yaml
on:
  push:
    branches:
      - main
      - production
```

**Deploy only on tags:**

```yaml
on:
  push:
    tags:
      - "v*"
```

**Add build tests before deploy:**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
      - run: cd client && npm ci && npm test
      - run: cd server && npm ci && npm test

  deploy:
    needs: test # Only deploy if tests pass
    runs-on: ubuntu-latest
    steps:
      # ... deploy steps
```

---

## 🛠️ Troubleshooting

### Workflow Fails with "Error: 401 Unauthorized"

❌ **Problem**: Invalid or missing `FLY_API_TOKEN`

✅ **Solution**:

```bash
# Get new token
fly auth token

# Update GitHub Secret
# Go to Settings → Secrets → Edit FLY_API_TOKEN
```

### Workflow Fails with "Error: App not found"

❌ **Problem**: App not initialized on Fly.io

✅ **Solution**:

```bash
fly launch --no-deploy
```

### Build Succeeds But App Doesn't Work

❌ **Problem**: Missing environment variables

✅ **Solution**:

```bash
# Check secrets
fly secrets list

# Add missing secrets
fly secrets set AI_PROVIDER=your_provider
```

### Deployment is Slow

⚠️ **Note**: First deployment takes ~2-5 minutes (Docker build)

✅ **Optimization**: The workflow uses `--remote-only` flag for remote builds

---

## 📊 Monitoring

### View Deployment Status

```bash
# Real-time logs
fly logs

# App status
fly status

# Recent deployments
fly releases
```

### Rollback if Needed

```bash
# List releases
fly releases

# Rollback to previous version
fly rollback <version-number>
```

---

## 🔐 Security Notes

- ✅ Never commit `FLY_API_TOKEN` to your repository
- ✅ Always use GitHub Secrets for sensitive data
- ✅ Token has full access to your Fly.io account - keep it secure
- ✅ Rotate token if compromised: `fly auth token` → Update GitHub Secret

---

## 💡 Tips

1. **Test locally first**: `docker build -t test .` before pushing
2. **Use branch protection**: Require PR reviews before merging to `main`
3. **Add status badge**: Show deployment status in README
4. **Monitor costs**: Check Fly.io dashboard regularly
5. **Set up alerts**: Use Fly.io monitoring for production apps

---

## 📚 Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Fly.io GitHub Actions](https://fly.io/docs/app-guides/continuous-deployment-with-github-actions/)
- [Fly.io Dashboard](https://fly.io/dashboard)
- [Your Workflows](https://github.com/your-username/ai-portfolio/actions)
