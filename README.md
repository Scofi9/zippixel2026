# ZipPixel – Image Compression SaaS

ZipPixel is a modern image compression SaaS built with Next.js, Redis, and Sharp. It allows users to upload and compress images instantly with a fast and premium user experience.

This document explains how to install, configure, and run ZipPixel on a new server.

---

# Tech Stack

* Next.js 15
* Node.js 18+
* Redis (Upstash recommended)
* Sharp (image compression)
* PM2 (process manager)
* Nginx (recommended for production)
* Linux server (Ubuntu 22.04 recommended)

---

# Features

* Image compression API
* Usage tracking
* Authentication-ready architecture
* Admin panel support
* Rate limiting protection
* Multi-language support
* Production-ready deployment structure

---

# Requirements

Before installing, make sure you have:

* Node.js 18 or newer
* npm or pnpm
* Redis database (Upstash recommended)
* Linux server (Ubuntu recommended)
* Domain (optional but recommended)

Check Node version:

```bash
node -v
```

---

# Installation

## Step 1 – Upload project files

Upload the project to your server:

```bash
git clone <your-repo-url>
cd zippixel
```

Or upload via ZIP and extract.

---

## Step 2 – Install dependencies

```bash
npm install
```

---

## Step 3 – Environment variables

Create file:

```bash
.env.local
```

Example:

```env
KV_REST_API_URL=https://your-upstash-url
KV_REST_API_TOKEN=your-upstash-token

NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

If using Clerk:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
```

---

## Step 4 – Build project

```bash
npm run build
```

---

## Step 5 – Start server

Test mode:

```bash
npm start
```

Production mode (recommended):

```bash
pm2 start ecosystem.config.cjs
```

Save PM2:

```bash
pm2 save
pm2 startup
```

---

# Default Port

Application runs on:

```bash
http://localhost:3001
```

---

# Nginx Configuration (recommended)

Example:

```nginx
server {
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

Restart nginx:

```bash
sudo systemctl restart nginx
```

---

# Admin Panel

Admin panel is available at:

```
/admin
```

Admin access can be configured via environment variables or Redis role assignment.

---

# File Structure

Important folders:

```
/app            → Frontend and API routes
/lib            → Redis and helper functions
/components     → UI components
/public         → Static assets
ecosystem.config.cjs → PM2 configuration
```

---

# Image Compression API

Endpoint:

```
POST /api/compress
```

Accepts multipart/form-data with image file.

Returns compressed image.

---

# Updating Project

To update:

```bash
git pull
npm install
npm run build
pm2 restart all
```

---

# Recommended Production Setup

Ubuntu 22.04
Node.js 18+
PM2
Nginx
Upstash Redis

---

# Support

This project is production-ready and designed to be easily customizable and scalable.

---

# License

Private commercial license. Ownership is transferred with sale.
