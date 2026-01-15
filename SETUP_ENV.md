# Environment Setup Instructions

## 📝 Create Your .env File

1. **Copy the example file:**
   ```powershell
   copy env.example .env
   ```

2. **Or create `.env` file manually** with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# IMPORTANT: Replace <db_password> with your actual MongoDB Atlas password
MONGODB_URI=mongodb+srv://rockwalt24_db_user:YOUR_ACTUAL_PASSWORD@cluster0.7hs0dyk.mongodb.net/retailcore?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters
JWT_EXPIRES_IN=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

## 🔑 Important Steps:

1. **Replace `<db_password>` or `YOUR_ACTUAL_PASSWORD`** with your actual MongoDB Atlas database password
2. **Change `JWT_SECRET`** to a strong random string (at least 32 characters)
3. **Save the file** as `.env` in the root directory

## ✅ Example:

If your MongoDB password is `MySecurePass123!`, your connection string should be:

```
MONGODB_URI=mongodb+srv://rockwalt24_db_user:MySecurePass123!@cluster0.7hs0dyk.mongodb.net/retailcore?retryWrites=true&w=majority
```

**Note:** If your password contains special characters like `@`, `#`, `%`, etc., you may need to URL-encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `%` becomes `%25`
- `&` becomes `%26`

## 🧪 Test Connection:

After creating `.env` file, run:
```bash
npm run dev
```

You should see:
```
☘️  MongoDB connected! DB HOST: cluster0.7hs0dyk.mongodb.net
🚀 Server is running at http://localhost:5000
```

## 🔒 Security Note:

- Never commit `.env` file to git (it's already in .gitignore)
- Keep your MongoDB password secure
- Use different passwords for development and production
