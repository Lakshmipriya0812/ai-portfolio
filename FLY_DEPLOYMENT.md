# AI Portfolio — Production Deployment Guide

This guide explains how to deploy the AI Portfolio app to Fly.io using GitHub Actions (recommended) or manually via CLI.

---

## Prerequisites

- GitHub account with the repository
- Fly.io account: [https://fly.io](https://fly.io)
- Node.js 18+ installed locally (for local testing)

---

## 1. Get Fly.io API Token

```bash
fly auth login
fly auth token
```

````

Copy the token for the next step.

---

## 2. Add Token to GitHub Secrets

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `FLY_API_TOKEN`
4. Paste the token and save

---

## 3. Initialize Fly.io App (One-Time)

```bash
cd /path/to/ai-portfolio
fly launch --no-deploy
```

- Choose app name and region
- Do **not** deploy yet

---

## 4. Set Environment Variables

```bash
fly secrets set NODE_ENV=production
fly secrets set AI_PROVIDER=your_provider
fly secrets set ALLOWED_ORIGINS=https://your-app.fly.dev
# Add other secrets as needed
```

---

## 5. Automatic Deployment via GitHub Actions

1. Push your code to `main` or `master`:

```bash
git add .
git commit -m "Deploy app"
git push origin main
```

✅ App will auto-deploy using `.github/workflows/fly-deploy.yml`.

### Manual Trigger

- Go to **Actions** → select **Deploy to Fly.io** → **Run workflow** → choose branch → **Run workflow**

---

## 6. Manual CLI Deployment (Optional)

```bash
# Deploy manually
fly deploy

# Monitor logs
fly logs

# Open app in browser
fly open
```

---

## 7. Local Testing (Optional)

```bash
docker build -t ai-portfolio .
docker run -p 8080:8080 \
  -e NODE_ENV=production \
  -e AI_PROVIDER=your_provider \
  -e ALLOWED_ORIGINS=http://localhost:8080 \
  ai-portfolio

# Access at http://localhost:8080
```

---

## 8. Monitoring & Rollback

```bash
fly logs           # Real-time logs
fly status         # App status
fly releases       # List releases
fly rollback <id>  # Rollback if needed
```

---

## 9. Security Notes

- Never commit `FLY_API_TOKEN` to the repo
- Use GitHub Secrets for all sensitive data
- Rotate token if compromised: `fly auth token` → update secret

---

## Resources

- [Fly.io Docs](https://fly.io/docs/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Fly.io Dashboard](https://fly.io/dashboard)

```

---
```
````
