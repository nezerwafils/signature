# Quick Start Guide - Vently

Get Vently up and running in minutes!

## Prerequisites

- Node.js v14+ installed
- MongoDB v4.4+ installed and running
- npm or yarn package manager

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/nezerwafils/signature.git
cd signature

# Install all dependencies (backend + frontend)
npm run install-all
```

### 2. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Windows
# Start MongoDB from Services or run mongod.exe
```

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# The default values work for local development
# No need to change anything for testing!
```

### 4. Run the Application

**Option A: Development Mode (Recommended)**
Runs both backend and frontend concurrently with hot-reload:

```bash
npm run dev
```

This will start:
- Backend API on http://localhost:5000
- Frontend on http://localhost:3000

**Option B: Production Mode**
Build and run optimized version:

```bash
npm run build
npm start
```

### 5. Create Your Account

1. Open http://localhost:3000 in your browser
2. Click "Get Started" or "Create Account"
3. Enter a username and password
4. (Optional) Add email for account recovery
5. Click "Create Account"

### 6. Start Using Vently!

**Record Your First Post:**
1. Click "Start Recording"
2. Allow microphone access when prompted
3. Record your voice message
4. Add a caption and hashtags
5. Click "Post"

**Explore:**
- Visit "Discover" to see all posts
- Search for users to follow
- Like, comment, and share posts
- Check notifications for interactions

## Common Issues & Solutions

### Port Already in Use
If port 3000 or 5000 is busy:

```bash
# Find and kill the process
# macOS/Linux
lsof -ti:3000 | xargs kill
lsof -ti:5000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Connection Error
```bash
# Verify MongoDB is running
mongosh  # or mongo

# Check MongoDB status
# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod
```

### Microphone Access Denied
- Check browser permissions
- HTTPS is required in production (not needed for localhost)
- Try a different browser if issues persist

### Module Not Found Error
```bash
# Clean install
rm -rf node_modules client/node_modules
rm package-lock.json client/package-lock.json
npm run install-all
```

## Default Credentials

For testing, you can create multiple accounts:
- No default accounts exist
- Create as many test users as needed
- Username must be 3-30 characters
- Password must be at least 6 characters

## Development Scripts

```bash
# Install all dependencies
npm run install-all

# Run backend only
npm run server

# Run frontend only
npm run client

# Run both (recommended for development)
npm run dev

# Build frontend for production
npm run build

# Run production server
npm start

# Run tests
npm test
```

## Project Structure Overview

```
vently/
├── server/           # Backend API
│   ├── models/      # Database models
│   ├── routes/      # API endpoints
│   └── middleware/  # Auth & upload handlers
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   └── services/    # API services
│   └── public/     # Static files
└── uploads/        # Audio files storage
```

## API Endpoints

The API runs on http://localhost:5000

Test the API health:
```bash
curl http://localhost:5000/api/health
```

See full API documentation in README.md

## Next Steps

1. ✅ Create your account
2. ✅ Record your first audio post
3. ✅ Follow some users
4. ✅ Explore the discover page
5. ✅ Customize your profile
6. 📚 Read the full README.md for advanced features
7. 🚀 Check DEPLOYMENT.md when ready to deploy

## Getting Help

- 📖 Read the full [README.md](README.md)
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
- 🐛 Report issues on GitHub
- 💬 Check console logs for detailed error messages

## Tips for Best Experience

1. **Use a good microphone** for better audio quality
2. **Keep recordings short** (under 2 minutes works best)
3. **Add hashtags** to make your posts discoverable
4. **Engage with others** - like, comment, and share
5. **Follow interesting users** to build your feed

---

**Welcome to Vently! 🎙️**

Your voice. Your moment. Your community.
