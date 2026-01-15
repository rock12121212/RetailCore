# RetailCore Frontend

React + MUI client for the RetailCore API.

## Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Run

```bash
npm run dev
```

## Auth flow

- Login and refresh set `refreshToken` (httpOnly) and `csrfToken` cookies.
- Access tokens are kept in memory and attached to outgoing requests.
- On `401`, the client automatically calls `/auth/refresh` once and retries.
