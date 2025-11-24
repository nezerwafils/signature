# Vently Setup Guide

This guide will help you set up Vently on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js

## Option 1: Quick Start with Docker (Recommended)

The easiest way to run Vently is using Docker Compose:

### Prerequisites
- **Docker** - [Download](https://www.docker.com/get-started)
- **Docker Compose** - Usually included with Docker Desktop

### Steps

1. Clone the repository:
```bash
git clone https://github.com/nezerwafils/signature.git
cd signature
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

4. To stop all services:
```bash
docker-compose down
```

5. To stop and remove all data:
```bash
docker-compose down -v
```

## Option 2: Manual Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/nezerwafils/signature.git
cd signature
```

### Step 2: Set Up MongoDB

#### On macOS (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### On Ubuntu/Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### On Windows:
Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

Verify MongoDB is running:
```bash
mongosh
# or
mongo
```

### Step 3: Set Up Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vently
JWT_SECRET=your_secure_jwt_secret_here_change_this
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. Start the backend server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Backend will run on http://localhost:5000

### Step 4: Set Up Frontend

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the frontend development server:
```bash
npm run dev
```

Frontend will run on http://localhost:5173 (Vite default) or http://localhost:3000

## Verifying the Setup

1. Open your browser and go to http://localhost:5173 (or your frontend URL)
2. You should see the Vently login page
3. Click "Sign up" and create a new account
4. After registration, you'll be logged in and see the home feed

## Troubleshooting

### MongoDB Connection Issues

If you see `MongooseServerSelectionError`:
- Ensure MongoDB is running: `mongosh` or `mongo`
- Check if MongoDB is on the correct port (default: 27017)
- Verify MONGODB_URI in your .env file

### Backend Not Starting

- Check if port 5000 is already in use
- Verify all dependencies are installed: `npm install`
- Check the .env file configuration

### Frontend Not Connecting to Backend

- Ensure backend is running on port 5000
- Verify VITE_API_URL in frontend/.env
- Check browser console for CORS errors
- Make sure FRONTEND_URL in backend/.env matches your frontend URL

### Port Already in Use

If port 5000 or 5173 is already in use:

Backend:
- Change PORT in backend/.env to another port (e.g., 5001)
- Update VITE_API_URL in frontend/.env accordingly

Frontend:
- Vite will automatically try the next available port
- Or specify a port: `npm run dev -- --port 3001`

## Development Tips

### Running Both Servers Simultaneously

Use two terminal windows/tabs:
- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm run dev`

### Using nodemon for Backend

Backend uses nodemon in development mode for auto-reloading when files change.

### Hot Module Replacement (HMR)

Frontend uses Vite's HMR for instant updates without full page reload.

## Next Steps

- Read the [API Documentation](../README.md#api-documentation)
- Check out [Contributing Guidelines](./CONTRIBUTING.md)
- Learn about [Deployment](./DEPLOYMENT.md)

## Getting Help

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/nezerwafils/signature/issues)
3. Create a new issue with detailed information about your problem

Happy coding! 🎙️
