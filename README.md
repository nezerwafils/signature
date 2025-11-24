# Vently - Audio-Only Social Media Platform

![Vently Logo](https://img.shields.io/badge/Vently-Audio%20Social-6C5CE7?style=for-the-badge)

Vently is a next-generation audio-only social media platform where users share voice moments, connect with friends, and discover new voices from around the world.

## ✨ Features

### Core Social Media Features
- **Audio Posts**: Record and share voice moments up to 10MB
- **User Profiles**: Customizable profiles with bio, avatar, and stats
- **Follow System**: Follow/unfollow users to build your network
- **Feed Algorithm**: Personalized feed from followed users
- **Discover Page**: Explore trending content and new voices
- **Interactions**: Like, comment, and share posts
- **Notifications**: Real-time notifications for interactions
- **Search**: Find users and content by username or hashtags
- **Trending Hashtags**: Discover popular topics

### Audio-Specific Features
- **Voice Recording**: In-browser audio recording with microphone access
- **Audio Playback**: Custom audio player with play/pause and seek controls
- **Waveform Visualization**: Visual representation of audio
- **Play Count Tracking**: Track how many times posts are played
- **Duration Display**: Show audio length in player

### Authentication & Security
- **Simple Signup**: Username and password only (email optional)
- **Password Recovery**: Email-based account recovery (optional)
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against abuse
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs

### UI/UX Excellence
- **Beautiful Design**: Modern, gradient-based color scheme
- **Dark Theme**: Eye-friendly dark mode interface
- **Responsive**: Mobile-first, works on all screen sizes
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Loading States**: Clear feedback during operations
- **Error Handling**: User-friendly error messages
- **Accessibility**: Semantic HTML and ARIA labels

## 🚀 Tech Stack

### Backend
- **Node.js** & **Express.js**: RESTful API server
- **MongoDB** & **Mongoose**: Database and ODM
- **JWT**: Authentication tokens
- **Bcrypt**: Password hashing
- **Multer**: File upload handling
- **Helmet**: Security headers
- **Compression**: Response compression
- **Rate Limiting**: API protection

### Frontend
- **React**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Context API**: State management
- **CSS3**: Custom styling with CSS variables
- **Web Audio API**: Audio recording and playback

## 📦 Installation

### Prerequisites
- Node.js v14 or higher
- MongoDB v4.4 or higher
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/nezerwafils/signature.git
   cd signature
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   - `PORT`: Server port (default: 5000)
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `NODE_ENV`: Environment (development/production)

4. **Start MongoDB**
   ```bash
   mongod
   ```

5. **Run the application**
   
   **Development mode** (runs both backend and frontend):
   ```bash
   npm run dev
   ```
   
   **Production build**:
   ```bash
   npm run build
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
vently/
├── server/                 # Backend code
│   ├── index.js           # Express server entry point
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   └── Notification.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   └── interactions.js
│   ├── middleware/        # Custom middleware
│   │   ├── auth.js
│   │   └── upload.js
│   └── utils/             # Utility functions
│
├── client/                # Frontend code
│   ├── public/           # Static assets
│   └── src/
│       ├── components/   # React components
│       │   ├── Navbar.js
│       │   ├── AudioPostCard.js
│       │   └── CreatePost.js
│       ├── pages/        # Page components
│       │   ├── LandingPage.js
│       │   ├── LoginPage.js
│       │   ├── RegisterPage.js
│       │   ├── HomePage.js
│       │   ├── DiscoverPage.js
│       │   ├── ProfilePage.js
│       │   └── NotificationsPage.js
│       ├── contexts/     # React contexts
│       │   └── AuthContext.js
│       ├── services/     # API services
│       │   └── api.js
│       ├── App.js        # Main app component
│       └── index.js      # Entry point
│
├── uploads/              # Uploaded audio files
├── package.json          # Root package.json
└── README.md            # This file
```

## 🎨 Design System

### Color Palette
- **Primary**: `#6C5CE7` (Purple)
- **Primary Light**: `#A29BFE` (Light Purple)
- **Secondary**: `#00B894` (Teal)
- **Accent**: `#FD79A8` (Pink)
- **Danger**: `#FF7675` (Red)
- **Background**: `#0F0F1E` (Dark)

### Typography
- **Font Family**: System fonts for optimal performance
- **Headings**: 700 weight
- **Body**: 400 weight
- **Small Text**: 12-14px

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure, expiring tokens
- **Rate Limiting**: Prevents brute force attacks
- **Input Sanitization**: Validates all user inputs
- **Helmet.js**: Sets security HTTP headers
- **CORS**: Configured for production use
- **File Upload Limits**: Max 10MB audio files
- **File Type Validation**: Only audio files accepted

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/recover` - Password recovery

### Users
- `GET /api/users/:username` - Get user profile
- `PUT /api/users/profile` - Update own profile
- `POST /api/users/:username/follow` - Follow user
- `POST /api/users/:username/unfollow` - Unfollow user
- `GET /api/users/:username/posts` - Get user's posts
- `GET /api/users/search/query` - Search users

### Posts
- `POST /api/posts` - Create post (with audio upload)
- `GET /api/posts/feed` - Get personalized feed
- `GET /api/posts/discover` - Get discover feed
- `GET /api/posts/:id` - Get single post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/play` - Increment play count
- `GET /api/posts/hashtag/:tag` - Get posts by hashtag
- `GET /api/posts/trending/hashtags` - Get trending hashtags

### Interactions
- `POST /api/interactions/posts/:id/like` - Like/unlike post
- `POST /api/interactions/posts/:id/comment` - Comment on post
- `GET /api/interactions/posts/:id/comments` - Get post comments
- `DELETE /api/interactions/comments/:id` - Delete comment
- `POST /api/interactions/comments/:id/like` - Like comment
- `POST /api/interactions/posts/:id/share` - Share post
- `GET /api/interactions/notifications` - Get notifications
- `PUT /api/interactions/notifications/:id/read` - Mark notification as read
- `PUT /api/interactions/notifications/read-all` - Mark all as read

## 🌟 Usage

### Creating an Account
1. Visit the landing page
2. Click "Get Started" or "Create Account"
3. Enter username and password (email optional)
4. Start sharing your voice!

### Recording Audio
1. Click "Start Recording" button
2. Allow microphone access when prompted
3. Speak your message
4. Click "Stop Recording"
5. Add caption and hashtags (optional)
6. Click "Post" to share

### Discovering Content
1. Navigate to "Discover" page
2. Browse trending hashtags
3. Listen to popular posts
4. Follow interesting users

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

Created with ❤️ by the Vently team

## 🙏 Acknowledgments

- Inspired by modern social media platforms
- Built with best practices in mind
- Designed for scalability and performance

---

**Vently** - Your voice. Your moment. Your community.