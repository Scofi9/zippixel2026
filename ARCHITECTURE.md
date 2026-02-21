# ZipPixel – System Architecture

This document explains the technical architecture of ZipPixel, including frontend, backend, storage, and infrastructure components.

ZipPixel is designed as a modern, scalable SaaS application using a server-side image compression pipeline.

---

# High-Level Architecture

User → Frontend (Next.js) → API Route → Compression Engine → Redis → Response

Components:

* Frontend (UI)
* API layer
* Compression engine
* Redis storage
* Authentication layer
* Admin monitoring

---

# Frontend Layer

Location:

```
/app
/components
/public
```

Technology:

* Next.js 15 (App Router)
* React
* TailwindCSS

Responsibilities:

* File upload interface
* Dashboard interface
* Admin interface
* Plan and usage display
* API communication

Frontend communicates with backend via internal API routes.

---

# Backend Layer

Location:

```
/app/api/
```

Architecture type:

Serverless-style API routes running on Node.js runtime.

Main endpoint:

```
POST /api/compress
```

Responsibilities:

* Receive uploaded image
* Validate input
* Check usage limits
* Compress image
* Track usage
* Return compressed file

---

# Compression Engine

Location:

```
/app/api/compress/route.ts
```

Technology:

* Sharp (Node.js image processing library)

Responsibilities:

* Resize image
* Optimize quality
* Reduce file size
* Preserve image integrity

Compression runs fully server-side.

No external compression service is used.

---

# Data Storage Layer

Technology:

Redis (Upstash recommended)

Location:

```
/lib/redis.ts
```

Responsibilities:

* Usage tracking
* Rate limiting
* Admin metrics
* Abuse protection

Redis is used because it provides:

* Very fast read/write
* Scalable architecture
* Low latency
* Cloud compatibility

---

# Authentication Layer

Technology:

Clerk (recommended)

Responsibilities:

* User authentication
* Session management
* User identification
* Role management (admin/user)

Authentication integrates directly with Next.js.

---

# Admin System

Location:

```
/app/admin/
```

Responsibilities:

* View total users
* View compression usage
* View system metrics
* Monitor platform activity

Admin panel reads metrics from Redis.

---

# Infrastructure Layer

Recommended production stack:

* Ubuntu 22.04 server
* Node.js 18+
* PM2 process manager
* Nginx reverse proxy
* Redis (Upstash)
* Domain with SSL

---

# Process Manager

File:

```
ecosystem.config.cjs
```

Technology:

PM2

Responsibilities:

* Run application in background
* Restart on crash
* Manage uptime
* Enable auto-start on reboot

---

# Reverse Proxy

Technology:

Nginx

Responsibilities:

* Handle incoming HTTP requests
* Forward traffic to Node.js app
* Enable HTTPS
* Improve performance

Flow:

User → Nginx → Node.js → Response

---

# Security Design

Includes:

* Usage limits
* Rate limiting
* Input validation
* Server-side processing only
* No direct file system exposure

---

# Scalability

ZipPixel can scale horizontally.

Scaling options:

* Move Redis to dedicated cluster
* Run multiple Node.js instances
* Load balancer support
* Deploy on cloud platforms

Compatible with:

* DigitalOcean
* AWS
* Vercel
* Railway
* VPS environments

---

# Deployment Flow

Deployment steps:

1. Upload project
2. Install dependencies
3. Configure environment variables
4. Build project
5. Start with PM2
6. Configure Nginx
7. Enable SSL

---

# Data Flow Diagram

Upload flow:

User
→ Frontend Upload
→ API Route
→ Sharp Compression
→ Redis usage update
→ Response returned

---

# Fault Tolerance

System is resilient because:

* PM2 restarts crashed processes
* Redis prevents abuse
* Stateless API design
* Independent infrastructure components

---

# Summary

ZipPixel is built using modern SaaS architecture principles:

* Clean separation of frontend and backend
* Fast compression engine
* Scalable storage layer
* Production-ready infrastructure
* Easy deployment and scaling

This architecture allows the system to run efficiently and scale as usage grows.
