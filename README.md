![Example](/apps/server/assets/ignore/banner.png)

> A Growtopia private server built with Node.js and Bun.js, powered by [growtopia.js](https://github.com/JadlionHD/growtopia.js)

> [!NOTE]
> This source is not production ready yet. In the future it will be using a [Docker](#docker) to deploy the server, feel free to join [Discord Server](https://discord.gg/sGrxfKZY5t) to discuss regarding this.

## Requirements

- [Node.js](https://nodejs.org) v20+ or [Bun.js](https://bun.sh) v1.2.9+
- [pnpm](https://pnpm.io) v10
- [mkcert](https://github.com/FiloSottile/mkcert)
- [docker](https://docker.com/)
- [docker-compose](https://docs.docker.com/compose/) (required)

## Setup

To setup the server, first install necessary packages & settings by

```
$ pnpm install
$ pnpm run setup
```

And congrats setup are done, simple as that!
Now you just need to run the server by

> [!NOTE]
> It must be running PostgreSQL & Redis in background by using docker, please navigate to [docker](#docker) guide

```
$ pnpm run dev
```

## Database

Database that we moved to PostgreSQL from previous database SQLite.
And for the ORM we are using [Drizzle-ORM](https://orm.drizzle.team/)

To view the database you can run this command below:

```
$ pnpm run studio
```

and access it on here https://local.drizzle.studio/

## Starting server

To run the development server by

```
$ pnpm run start
```

## Development

In order to make new login system work you need to install [mkcert](https://github.com/FiloSottile/mkcert) on this [download page](https://github.com/FiloSottile/mkcert/releases) (I'd recommend using [Lets encrypt](https://letsencrypt.org/getting-started/) for production only)

### Local CA installation

Install the mkcert local CA by

```
$ mkcert -install
```

### Hosts

For the hosts file you can see this example below

```
127.0.0.1 www.growtopia1.com
127.0.0.1 www.growtopia2.com
127.0.0.1 login.growserver.app # New login system for development purposes
```

## Docker

To run the dockerized & running it automatically just run

```sh
docker compose up -d
```

or you want to run the database & redis only (this were for development only) then simply running

```sh
docker compose up -d db redis
```

## Cloud Deployment

> [!IMPORTANT]
> This server requires **UDP port support** for the ENet game server (port 17091). Not all cloud platforms support UDP ports. See the comparison below.

### Platform Comparison

| Platform | UDP Support | Multiple Ports | PostgreSQL | Redis | Docker | Recommended |
|----------|-------------|----------------|------------|-------|--------|-------------|
| **Railway** | ✅ Yes | ✅ Yes | ✅ Built-in | ✅ Built-in | ✅ Yes | ⭐ **Best Choice** |
| **Render** | ✅ Yes | ✅ Yes | ✅ Built-in | ✅ Built-in | ✅ Yes | ⭐ **Best Choice** |
| **Fly.io** | ✅ Yes | ✅ Yes | ✅ Built-in | ✅ Built-in | ✅ Yes | ⭐ **Best Choice** |
| **DigitalOcean App Platform** | ✅ Yes | ✅ Yes | ✅ Built-in | ✅ Built-in | ✅ Yes | ✅ Good |
| **Google Cloud Run** | ❌ No | ❌ No | ✅ Cloud SQL | ✅ Memorystore | ✅ Yes | ⚠️ Web only |
| **AWS ECS/EC2** | ✅ Yes | ✅ Yes | ✅ RDS | ✅ ElastiCache | ✅ Yes | ✅ Good |
| **Heroku** | ❌ No | ❌ No | ✅ Built-in | ✅ Built-in | ❌ No | ⚠️ Web only |

---

### Railway Deployment (Recommended)

[Railway](https://railway.app) supports UDP ports, multiple services, and has built-in PostgreSQL and Redis.

1. Install Railway CLI:
```sh
npm install -g @railway/cli
railway login
```

2. Create a new project and deploy:
```sh
railway init
railway up
```

3. Add PostgreSQL and Redis services from Railway dashboard

4. Set environment variables:
```sh
railway variables set JWT_SECRET=your-secret-key
railway variables set WEB_ADDRESS=your-app.railway.app
railway variables set LOGIN_URL=your-app.railway.app
```

---

### Render Deployment (Recommended)

[Render](https://render.com) supports UDP ports via their "Private Services" and has native PostgreSQL/Redis.

1. Create a new Web Service from your GitHub repo
2. Add PostgreSQL and Redis from the Render dashboard
3. Configure environment variables in the dashboard
4. For UDP support, create a "Private Service" for the game server

---

### Fly.io Deployment (Recommended)

[Fly.io](https://fly.io) has excellent UDP support and global edge deployment.

1. Install Fly CLI:
```sh
curl -L https://fly.io/install.sh | sh
fly auth login
```

2. Launch your app:
```sh
fly launch
```

3. The `fly.toml` file is included in this repository. Customize it for UDP support:
```toml
[[services]]
  internal_port = 17091
  protocol = "udp"

  [[services.ports]]
    port = 17091
```

4. Add PostgreSQL:
```sh
fly postgres create
fly postgres attach
```

5. Add Redis:
```sh
fly redis create
```

---

### Heroku Deployment (Web Services Only)

> [!WARNING]
> Heroku does **NOT** support UDP ports. You can only deploy the web frontend and login services on Heroku. The game server must run on a separate VPS or UDP-capable platform.

#### Quick Deploy

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

#### Manual Deployment

1. Create a new Heroku app:
```sh
heroku create your-app-name
```

2. Add PostgreSQL addon:
```sh
heroku addons:create heroku-postgresql:essential-0
```

3. Set required environment variables:
```sh
heroku config:set JWT_SECRET=your-secret-key
heroku config:set WEB_ADDRESS=your-game-server-ip
heroku config:set LOGIN_URL=your-app-name.herokuapp.com
```

4. Deploy:
```sh
git push heroku main
```

---

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Web server port (auto-set by most platforms) | Auto |
| `DATABASE_URL` | PostgreSQL connection URL | Yes |
| `REDIS_URL` | Redis connection URL | No |
| `JWT_SECRET` | Secret key for JWT authentication | Yes |
| `WEB_ADDRESS` | Server address for game connections | Yes |
| `WEB_PORT` | HTTPS server port (default: 443) | No |
| `WEB_FRONTEND_PORT` | Web frontend port (default: 8080) | No |
| `SERVER_PORTS` | Comma-separated game server ports | No |
| `LOGIN_URL` | Login URL for game client | Yes |
| `CDN_URL` | CDN URL for game assets | No |
| `LOG_LEVEL` | Logging level (debug, info, warn, error) | No |

## Contributing

Any contributions are welcome.

There's few rules of contributing:

- Code must match the existing code style. Please make sure to run `pnpm run lint` before submiting a PR.
- The commit must take review first before merging into `main` branch.

## Links

- [Discord Server](https://discord.gg/sGrxfKZY5t)

## Contributors

Give a thumbs to these cool contributors:

<a href="https://github.com/StileDevs/GrowServer">
  <img src="https://contrib.rocks/image?repo=StileDevs/GrowServer"/>
</a
