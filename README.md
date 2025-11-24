# Vently 🎙️

**Vently** is a modern audio-only social media platform where users share their voice, connect with communities, and discover trending audio content. Built with a focus on simplicity, creativity, and proactive user experience.

![Vently Logo](https://img.shields.io/badge/Vently-Audio%20Social%20Media-8B5CF6?style=for-the-badge&logo=soundcloud&logoColor=white)

## ✨ Features

### Core Features
- 🎤 **Audio Recording & Upload** - Record audio directly in-browser or upload audio files
- 🎵 **Audio Playback** - Smooth, feature-rich audio player with controls
- 👥 **Social Connections** - Follow users, build your community
- ❤️ **Engagement** - Like, comment, and share audio posts
- 🔍 **Discovery** - Explore trending content and search for users
- 📊 **User Profiles** - Personalized profiles with stats and posts
- 🔐 **Simple Authentication** - Sign up with just username & password (email optional for recovery)

### Technical Features
- 🎨 Modern, responsive UI with dark theme
- 🚀 Production-ready architecture
- 🔒 Secure authentication with JWT
- 📱 Mobile-responsive design
- ⚡ Fast and efficient API
- 💾 MongoDB for data persistence
- 🎯 RESTful API design

## 🏗️ Tech Stack

### Backend
- **Node.js** & **Express** - Fast, unopinionated web framework
- **MongoDB** & **Mongoose** - NoSQL database with elegant ODM
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Express Validator** - Input validation

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Vite** - Fast build tool
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **CSS3** - Custom styling with CSS variables

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vently
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. Start MongoDB:
```bash
# macOS/Linux
mongod

# Windows
mongod.exe
```

6. Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173` (Vite default)

## 🚀 Usage

1. **Register**: Create an account with username and password (email optional)
2. **Login**: Sign in with your credentials
3. **Create Posts**: Record or upload audio content with captions
4. **Discover**: Explore audio posts from the community
5. **Engage**: Like, comment, and share posts
6. **Connect**: Follow users and build your network
7. **Profile**: View and manage your profile and posts

## 📁 Project Structure

```
vently/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   └── routes/         # API routes
│   ├── uploads/            # Uploaded audio files
│   ├── server.js           # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── App.jsx         # Main app component
│   │   └── index.css       # Global styles
│   └── package.json
│
└── README.md
```

## 🎨 Design Philosophy

Vently's design focuses on:
- **Simplicity**: Clean, intuitive interface
- **Audio-First**: Audio content is the star
- **Dark Theme**: Easy on the eyes, modern aesthetic
- **Gradient Accents**: Purple-to-pink gradient (#8B5CF6 → #EC4899)
- **Responsive**: Works seamlessly on all devices
- **Accessibility**: Keyboard navigation and screen reader support

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Input validation and sanitization
- CORS configuration
- File type validation for uploads
- Protected routes and endpoints

## 📝 API Documentation

### Authentication Endpoints

```
POST /api/auth/register      - Register new user
POST /api/auth/login         - Login user
GET  /api/auth/me            - Get current user
PUT  /api/auth/profile       - Update profile
GET  /api/auth/profile/:username - Get user profile
```

### Posts Endpoints

```
POST   /api/posts            - Create new post
GET    /api/posts/feed       - Get user feed
GET    /api/posts/discover   - Get discover posts
GET    /api/posts/user/:username - Get user posts
GET    /api/posts/:id        - Get single post
POST   /api/posts/:id/like   - Like/unlike post
POST   /api/posts/:id/comment - Add comment
DELETE /api/posts/:id        - Delete post
```

### Users Endpoints

```
POST /api/users/:username/follow   - Follow user
POST /api/users/:username/unfollow - Unfollow user
GET  /api/users/:username/followers - Get followers
GET  /api/users/:username/following - Get following
GET  /api/users/search             - Search users
```

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## 🚢 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or similar cloud database
2. Configure environment variables on your hosting platform
3. Deploy to platforms like Heroku, Railway, or DigitalOcean
4. Ensure uploads directory is persistent or use cloud storage (AWS S3, Cloudinary)

### Frontend Deployment
1. Update `VITE_API_URL` in `.env` to production API URL
2. Build the project: `npm run build`
3. Deploy to Vercel, Netlify, or similar platforms

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👏 Acknowledgments

- Icons by [Lucide Icons](https://lucide.dev/)
- Inspired by modern social media platforms
- Built with love for the audio creator community

## 📧 Contact

For questions, issues, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ by the Vently Team**

Vently - *Your voice, your community* 🎙️