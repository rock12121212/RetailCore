## RetailCore React - Run Guide

This document covers frontend setup, env, and run commands.

## Prerequisites

- Node.js 20.11+ (compatible with Vite 5)
- npm 10+

## Install

```bash
cd frontend
npm install
```

## Environment Variables

Create a `frontend/.env` file:

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Run (Dev)

```bash
npm run dev
```

Default dev URL: `http://localhost:5173`

To change the port:

```bash
npm run dev -- --port 3000
```

## Build (Prod)

```bash
npm run build
npm run preview
```

## Notes

- Login sets `refreshToken` (httpOnly) and `csrfToken` cookies.
- Access tokens are stored in memory and refreshed automatically on `401`.
