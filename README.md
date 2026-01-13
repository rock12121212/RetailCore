# RetailCore Node.js Application

A robust, feature-based (modular) Node.js Express application structure built with modern best practices.

## Architecture Highlights

- **ES Modules (ESM)**: Native support for `import/export`.
- **Feature-based Structure**: Code is organized by domain (e.g., `auth`, `user`).
- **Enhanced Security**:
  - **Rate Limiting**: Protection against brute-force attacks.
  - **NoSQL Injection Protection**: Sanitizes user-supplied data to prevent injection.
  - **HTTP Parameter Pollution (HPP)**: Protects against HPP attacks.
  - **Secure Headers**: via `Helmet`.
  - **Secure Cookies**: via `cookie-parser`.
- **Centralized Error Handling**: Unified error responding with custom `ApiError` classes.
- **Environment Validation**: Validates required environment variables on startup.
- **Developer Experience**: Pre-configured with ESLint and Prettier.

## Folder Structure

```text
src/
├── app.js                 # Express app initialization & middleware
├── server.js              # Entry point & DB connection
├── routes.js              # Main route loader
│
├── config/                # Configuration files
│   ├── db.config.js       # Database (Mongoose) connection
│   ├── env.config.js      # Environment variable management
│   └── logger.config.js   # Logger (Morgan) setup
│
├── modules/               # Feature-based modules (Feature Domain)
│   ├── auth/              # Authentication module
│   │   ├── auth.routes.js
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   └── auth.validation.js
│   └── user/              # User module
│       ├── user.model.js
│       ├── user.routes.js
│       ├── user.controller.js
│       ├── user.service.js
│       └── user.validation.js
│
├── middlewares/           # Global middlewares
│   ├── auth.middleware.js # JWT verification
│   ├── error.middleware.js # Centralized error handler
│   └── rateLimit.middleware.js # Rate limiting placeholder
│
├── utils/                 # Shared utilities
│   ├── apiResponse.js     # Standard API response formatter
│   ├── apiError.js        # Custom API error class
│   ├── asyncHandler.js    # Async wrapper for controllers
│   ├── constants.js       # App constants
│   └── helpers.js         # General helper functions
│
└── validations/           # Common data validations
```

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Copy `.env.example` to `.env` and fill in the values.
   ```bash
   cp .env.example .env
   ```

3. **Run in Development**:
   ```bash
   npm run dev
   ```

4. **Run in Production**:
   ```bash
   npm start
   ```

## Key Dependencies

- **Express**: Fast, unopinionated, minimalist web framework.
- **Mongoose**: Elegant mongodb object modeling for node.js.
- **JWT**: Industry standard for secure information transmission.
- **Bcryptjs**: Optimized bcrypt in JavaScript with zero dependencies.
- **Helmet**: Security-oriented HTTP headers.
- **Morgan**: HTTP request logger middleware.
