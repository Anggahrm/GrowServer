# Deploying GrowServer to Heroku

This guide explains how to deploy GrowServer to Heroku.

## Important Limitations

Please note the following limitations when deploying to Heroku:

### 1. UDP/ENet Server Not Supported
Heroku does not support UDP connections, which means the ENet game server (port 17091) will **not work** on Heroku. The application will only run the web/HTTP interface on Heroku.

If you need the full game server functionality (including UDP/ENet), consider alternatives like:
- DigitalOcean Droplets
- AWS EC2
- Google Cloud Compute Engine
- A VPS with UDP support

### 2. Ephemeral Filesystem
Heroku uses an ephemeral filesystem, meaning:
- Files are reset on each dyno restart
- SQLite database will be lost on restart
- For production use, you should migrate to a persistent database like PostgreSQL

### 3. SSL/TLS Certificates
Heroku handles SSL termination at the router level, so the application runs HTTP internally. The mkcert setup is automatically skipped on Heroku.

## Prerequisites

1. A [Heroku account](https://signup.heroku.com/)
2. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
3. Git installed

## Deployment Methods

### Method 1: Deploy via Heroku CLI

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create a new Heroku app**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=YourSuperSecretKey
   heroku config:set RUNTIME_ENV=node
   heroku config:set NODE_ENV=production
   ```

4. **Deploy the application**
   ```bash
   git push heroku main
   ```

5. **Open the application**
   ```bash
   heroku open
   ```

### Method 2: Deploy via Heroku Dashboard

1. Go to [Heroku Dashboard](https://dashboard.heroku.com/)
2. Click "New" → "Create new app"
3. Enter your app name and choose a region
4. Go to "Deploy" tab
5. Connect your GitHub repository
6. Enable automatic deploys (optional)
7. Click "Deploy Branch"

### Method 3: One-Click Deploy

Click the button below to deploy directly to Heroku:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Configuration

### Environment Variables

The following environment variables should be configured in your Heroku app:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `JWT_SECRET` | Secret key for JWT authentication | Yes | - |
| `DISCORD_BOT_TOKEN` | Discord bot token (if using Discord integration) | No | - |
| `NODE_ENV` | Node environment | No | `production` |
| `RUNTIME_ENV` | Runtime environment (node or bun) | No | `node` |
| `PORT` | Port number (automatically set by Heroku) | No | - |

You can set these via the Heroku Dashboard or CLI:
```bash
heroku config:set VARIABLE_NAME=value
```

## Post-Deployment

### View Logs
```bash
heroku logs --tail
```

### Scale Dynos
```bash
heroku ps:scale web=1
```

### Database Migration (Recommended)

Since Heroku's filesystem is ephemeral, it's recommended to migrate from SQLite to PostgreSQL for production:

1. **Add PostgreSQL addon**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

2. **Update your database configuration** to use the `DATABASE_URL` environment variable provided by Heroku.

## Troubleshooting

### Build Failures

If the build fails, check the logs:
```bash
heroku logs --tail
```

Common issues:
- **Out of memory**: Upgrade to a larger dyno
- **Build timeout**: The build process might be too long for free tier

### Application Crashes

Check the logs and ensure:
- All environment variables are set correctly
- The PORT environment variable is being used
- Dependencies are properly installed

### Database Issues

Remember that SQLite data is ephemeral on Heroku. Consider:
- Using Heroku Postgres addon
- Implementing database migrations
- Seeding data on startup

## Monitoring

Monitor your application using:
```bash
heroku logs --tail              # View logs
heroku ps                       # Check dyno status
heroku run bash                 # Access dyno shell
```

## Cost Considerations

- **Free Tier**: Limited to 550-1000 dyno hours per month
- **Hobby Tier**: $7/month per dyno
- **Add-ons**: PostgreSQL starts free (10k rows limit)

## Additional Resources

- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Heroku Deployment Guide](https://devcenter.heroku.com/articles/deploying-nodejs)
- [Managing Environment Variables](https://devcenter.heroku.com/articles/config-vars)

## Support

For issues related to:
- **GrowServer**: Join the [Discord Server](https://discord.gg/sGrxfKZY5t)
- **Heroku Platform**: Check [Heroku Support](https://help.heroku.com/)
