# Best Practices Guide

This document outlines the best practices implemented in the RetailCore API project.

## 📁 Project Structure

```
src/
├── config/          # Configuration files (DB, env, logger)
├── middlewares/     # Express middlewares (auth, error, validation, rate limit)
├── modules/         # Feature modules (auth, user, etc.)
│   └── [module]/
│       ├── [module].controller.js
│       ├── [module].routes.js
│       ├── [module].service.js
│       ├── [module].model.js
│       └── [module].validation.js
├── utils/           # Utility functions and helpers
└── routes.js        # Main router that combines all module routes
```

## 🔐 Security Best Practices

### 1. **Input Validation**
- ✅ All API endpoints use `express-validator` for input validation
- ✅ Validation middleware (`validate`) automatically handles validation errors
- ✅ Validation schemas are defined in `[module].validation.js` files
- ✅ Sanitization: Email normalization, trim whitespace, etc.

**Example:**
```javascript
// In routes
router.post('/register', validate(validateRegister), register);

// In validation file
export const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
];
```

### 2. **Security Middlewares**
- ✅ **Helmet**: Sets various HTTP headers for security
- ✅ **CORS**: Configured with specific origin
- ✅ **express-mongo-sanitize**: Prevents NoSQL injection attacks
- ✅ **hpp**: Prevents HTTP Parameter Pollution
- ✅ **Rate Limiting**: Prevents brute force attacks
- ✅ **JWT Authentication**: Secure token-based auth

### 3. **Error Handling**
- ✅ Centralized error handling via `errorHandler` middleware
- ✅ Custom `ApiError` class for consistent error responses
- ✅ Errors are logged with full context (request ID, user, etc.)
- ✅ Stack traces only in development mode

## 📝 Logging Best Practices

### 1. **Winston Logger**
- ✅ Structured logging with Winston
- ✅ Separate log files: `combined.log` and `error.log`
- ✅ Log rotation (5MB max, 5 files)
- ✅ Console output in development, file-only in production
- ✅ Request logging via Morgan integrated with Winston

### 2. **Logging Levels**
- **info**: General application flow, successful operations
- **warn**: Warning messages for potential issues
- **error**: Error messages with full context
- **debug**: Detailed debugging information (development only)

### 3. **What to Log**
- ✅ All API errors with full context
- ✅ Authentication attempts (login, register, logout)
- ✅ Important business operations
- ✅ Request ID for tracing
- ✅ User ID when available
- ❌ Never log passwords, tokens, or sensitive data

**Example:**
```javascript
logInfo('User registered successfully', {
  requestId: req.id,
  userId: user._id,
  email: user.email,
});
```

### 4. **Request Tracing**
- ✅ Unique request ID for each request
- ✅ Request ID included in response headers (`X-Request-ID`)
- ✅ Request ID logged with all operations
- ✅ Request ID included in error responses

## ✅ Validation Best Practices

### 1. **Validation Rules**
- ✅ Always validate required fields
- ✅ Validate data types and formats
- ✅ Set appropriate length constraints
- ✅ Use regex for complex validations (e.g., password strength)
- ✅ Normalize data (email, trim strings)

### 2. **Validation Structure**
```javascript
// 1. Define validation rules in [module].validation.js
export const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
];

// 2. Apply in routes
router.post('/register', validate(validateRegister), register);

// 3. Validation errors automatically handled
```

### 3. **Error Response Format**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    }
  ]
}
```

## 🏗️ Code Organization

### 1. **Module Structure**
Each feature module should have:
- `[module].controller.js` - Request/response handling
- `[module].routes.js` - Route definitions
- `[module].service.js` - Business logic
- `[module].model.js` - Database models
- `[module].validation.js` - Input validation rules

### 2. **Separation of Concerns**
- **Controllers**: Handle HTTP requests/responses, call services
- **Services**: Contain business logic, interact with models
- **Models**: Define data structure and database operations
- **Routes**: Define endpoints and apply middlewares
- **Validation**: Define validation rules separately

### 3. **Async Error Handling**
- ✅ Use `asyncHandler` wrapper for async route handlers
- ✅ Errors automatically caught and passed to error middleware
- ✅ No need for try-catch in controllers

## 🚀 Performance Best Practices

### 1. **Middleware Order**
1. Request ID (first)
2. Security (helmet, CORS, sanitization)
3. Body parsing
4. Logging
5. Rate limiting
6. Routes
7. Error handling (last)

### 2. **Response Compression**
- ✅ Gzip compression enabled for all responses

### 3. **Body Size Limits**
- ✅ JSON: 16kb limit
- ✅ URL-encoded: 16kb limit

## 📋 Environment Configuration

### 1. **Required Environment Variables**
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - CORS allowed origin

### 2. **Environment Validation**
- ✅ Server fails to start if required env vars are missing
- ✅ Default values provided where appropriate

## 🧪 Testing Recommendations

### 1. **Unit Tests**
- Test services independently
- Mock database operations
- Test validation rules

### 2. **Integration Tests**
- Test API endpoints
- Test authentication flow
- Test error handling

### 3. **Test Structure**
```
tests/
├── unit/
│   ├── services/
│   └── utils/
├── integration/
│   └── api/
└── fixtures/
```

## 📦 Dependencies Management

### 1. **Production Dependencies**
- Only include what's needed in production
- Keep dependencies up to date
- Use exact versions for critical packages

### 2. **Security**
- Regularly run `npm audit`
- Update packages with security vulnerabilities
- Use `npm ci` in production

## 🔄 API Response Standards

### 1. **Success Response**
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Operation successful",
  "success": true
}
```

### 2. **Error Response**
```json
{
  "statusCode": 400,
  "message": "Error message",
  "success": false,
  "errors": [ ... ],
  "requestId": "uuid"
}
```

## 📚 Additional Recommendations

### 1. **Documentation**
- ✅ Use JSDoc comments for functions
- ✅ Document API endpoints (consider Swagger/OpenAPI)
- ✅ Keep README updated

### 2. **Code Quality**
- ✅ Use ESLint for code linting
- ✅ Use Prettier for code formatting
- ✅ Follow consistent naming conventions

### 3. **Database**
- ✅ Use indexes for frequently queried fields
- ✅ Validate data at model level (Mongoose schemas)
- ✅ Use transactions for multi-step operations

### 4. **Monitoring**
- ✅ Monitor error rates
- ✅ Monitor response times
- ✅ Set up alerts for critical errors
- ✅ Monitor log file sizes

### 5. **Deployment**
- ✅ Use environment-specific configurations
- ✅ Don't commit `.env` files
- ✅ Use process managers (PM2) in production
- ✅ Set up log rotation
- ✅ Monitor application health

## 🎯 Quick Checklist for New Features

When adding a new feature:

- [ ] Create module folder structure
- [ ] Define validation rules
- [ ] Implement service logic
- [ ] Create controller handlers
- [ ] Define routes with validation
- [ ] Add logging for important operations
- [ ] Test error scenarios
- [ ] Update documentation

## 📝 Log Files Location

Logs are stored in: `logs/`
- `combined.log` - All logs
- `error.log` - Error logs only

**Note:** The `logs/` directory is gitignored and should not be committed.
