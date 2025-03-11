# The Prep Group - Docker Deployment Guide

This guide explains how to deploy The Prep Group website using Docker Compose, including FileBrowser and Cloudflare Tunnels for secure access.

## Components

- **SvelteKit Application**: The main web application
- **Neon Database**: External PostgreSQL database service for storing application data
- **FileBrowser**: File management system accessible at https://files.theprepgroup.us
- **Cloudflare Tunnels**: For secure, encrypted access without exposing ports

## Prerequisites

- Docker and Docker Compose installed on your server
- A Cloudflare account with Zero Trust enabled
- Domain names configured in Cloudflare (theprepgroup.us, files.theprepgroup.us)
- A Neon database account with a PostgreSQL database set up

## Setup Instructions

### 1. Configure Environment Variables

Copy the example environment file and update it with your settings:

```bash
cp .env.docker .env
```

Edit the `.env` file to set:
- Cloudflare Tunnel token (obtained from Cloudflare Zero Trust dashboard)

Your Neon database connection string should be set as an environment variable on your host system or in your deployment platform.

### 2. Set Up Cloudflare Tunnel

1. Log in to the [Cloudflare Zero Trust Dashboard](https://dash.teams.cloudflare.com/)
2. Navigate to Access > Tunnels
3. Create a new tunnel and note the token
4. Add the token to your `.env` file as `CLOUDFLARE_TUNNEL_TOKEN`
5. Configure DNS routing:
   - Route `theprepgroup.us` to `http://webapp:3000`
   - Route `files.theprepgroup.us` to `http://filebrowser:80`

### 3. Build and Start the Application

```bash
docker-compose up -d
```

This will:
- Build the SvelteKit application
- Start the PostgreSQL database
- Start FileBrowser at port 8080
- Connect to Cloudflare Tunnels

### 4. Initialize FileBrowser

On first run, you'll need to create an admin user for FileBrowser:

```bash
docker-compose exec filebrowser filebrowser users add admin password --perm.admin
```

Replace `password` with a secure password.

### 5. Access Your Applications

Once everything is running:
- Main website: https://theprepgroup.us
- File Browser: https://files.theprepgroup.us

## Maintenance

### Updating the Application

To update the application:

```bash
git pull
docker-compose build webapp
docker-compose up -d
```

### Backup

To backup your data:

```bash
# Database backup
docker-compose exec postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup_$(date +%Y%m%d).sql

# Files backup
tar -czf files_backup_$(date +%Y%m%d).tar.gz ./files
```

### Logs

To view logs:

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs webapp
docker-compose logs filebrowser
docker-compose logs cloudflared
```

## Troubleshooting

### Cloudflare Tunnel Issues

If the Cloudflare Tunnel isn't connecting:
1. Verify the tunnel token is correct
2. Check the cloudflared logs: `docker-compose logs cloudflared`
3. Ensure the tunnel is active in the Cloudflare dashboard

### Database Connection Issues

If the webapp can't connect to the Neon database:
1. Check that your Neon database is running and accessible
2. Verify the DATABASE_URL environment variable is correctly set in your host environment
3. Check the webapp logs for connection errors: `docker-compose logs webapp`

### FileBrowser Access Issues

If you can't access FileBrowser:
1. Verify the Cloudflare DNS routing is correct
2. Check if the filebrowser container is running: `docker-compose ps`
3. Check filebrowser logs: `docker-compose logs filebrowser`
