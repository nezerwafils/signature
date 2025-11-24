# Vently Deployment Guide

This guide covers deploying Vently to production environments.

## Pre-Deployment Checklist

- [ ] Change JWT_SECRET to a strong, unique secret
- [ ] Set up a production MongoDB database (MongoDB Atlas recommended)
- [ ] Configure CORS for your production domain
- [ ] Set up environment variables on hosting platform
- [ ] Test the application thoroughly in a staging environment
- [ ] Set up SSL/HTTPS
- [ ] Configure file upload storage (consider AWS S3 or Cloudinary)
- [ ] Set up monitoring and logging

## Deployment Options

### Option 1: Deploy to Heroku

#### Backend Deployment

1. Create a Heroku app:
```bash
heroku create vently-backend
```

2. Set up MongoDB Atlas:
   - Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get connection string

3. Set environment variables:
```bash
heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
heroku config:set JWT_SECRET=your_strong_secret_key
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend-domain.com
```

4. Deploy:
```bash
cd backend
git init
heroku git:remote -a vently-backend
git add .
git commit -m "Deploy backend"
git push heroku main
```

#### Frontend Deployment

Deploy to Vercel, Netlify, or Heroku:

**Using Vercel:**
```bash
cd frontend
npm install -g vercel
vercel --prod
```

Set environment variable in Vercel dashboard:
- `VITE_API_URL`: Your Heroku backend URL

### Option 2: Deploy to Railway

1. Create account at [Railway](https://railway.app/)
2. Create new project
3. Add MongoDB service
4. Add backend service:
   - Connect GitHub repository
   - Set root directory to `backend`
   - Add environment variables
5. Add frontend service:
   - Connect GitHub repository
   - Set root directory to `frontend`
   - Add environment variables

### Option 3: Deploy to DigitalOcean

#### Using App Platform

1. Create a DigitalOcean account
2. Go to App Platform
3. Create new app from GitHub repository
4. Configure components:
   - Backend: Node.js service
   - Frontend: Static site
   - Database: Managed MongoDB

#### Using Droplets (VPS)

1. Create a droplet (Ubuntu 22.04 recommended)
2. SSH into your droplet
3. Install Node.js and MongoDB
4. Clone repository and set up
5. Use PM2 to keep apps running
6. Set up Nginx as reverse proxy
7. Configure SSL with Let's Encrypt

### Option 4: Docker Deployment

1. Build images:
```bash
docker build -t vently-backend ./backend
docker build -t vently-frontend ./frontend
```

2. Push to container registry (Docker Hub, AWS ECR, etc.)

3. Deploy using your preferred container orchestration:
   - Docker Swarm
   - Kubernetes
   - AWS ECS
   - Google Cloud Run

## Environment Variables

### Backend Production Variables

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vently
JWT_SECRET=very_long_random_string_change_this_in_production
NODE_ENV=production
FRONTEND_URL=https://vently.yourdomain.com
```

### Frontend Production Variables

```env
VITE_API_URL=https://api.vently.yourdomain.com/api
```

## Database Setup (MongoDB Atlas)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user
4. Whitelist IP addresses (or allow from anywhere for development)
5. Get connection string
6. Update MONGODB_URI in your environment

## File Storage Configuration

For production, consider using cloud storage instead of local file storage:

### AWS S3

1. Create S3 bucket
2. Install aws-sdk: `npm install aws-sdk`
3. Update upload middleware to use S3
4. Set environment variables:
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=vently-uploads
```

### Cloudinary

1. Create Cloudinary account
2. Install cloudinary: `npm install cloudinary`
3. Update upload middleware
4. Set environment variables:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## SSL/HTTPS Setup

### Using Let's Encrypt (for VPS)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Using Cloudflare

1. Add your domain to Cloudflare
2. Update nameservers
3. Enable SSL/TLS encryption
4. Set SSL mode to "Flexible" or "Full"

## Nginx Configuration (for VPS)

```nginx
# Backend
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/vently/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Process Management with PM2 (for VPS)

```bash
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name vently-backend

# Start frontend (after build)
cd frontend
npm run build
pm2 serve dist 3000 --spa --name vently-frontend

# Save PM2 configuration
pm2 save
pm2 startup
```

## Monitoring and Logging

### Using PM2 Logs

```bash
pm2 logs vently-backend
pm2 logs vently-frontend
```

### External Monitoring Services

- [Sentry](https://sentry.io/) - Error tracking
- [LogRocket](https://logrocket.com/) - Frontend monitoring
- [DataDog](https://www.datadoghq.com/) - Full-stack monitoring
- [New Relic](https://newrelic.com/) - Application performance

## Scaling Considerations

### Database Indexing

Add indexes to frequently queried fields:
```javascript
// In User model
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

// In Post model
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
```

### Caching

Implement Redis for caching:
```bash
npm install redis
```

### Load Balancing

Use load balancer for multiple backend instances:
- Nginx
- HAProxy
- Cloud provider load balancers

### CDN

Use CDN for static assets:
- Cloudflare
- AWS CloudFront
- Fastly

## Security Best Practices

1. **Rate Limiting**: Implement rate limiting on API endpoints
```bash
npm install express-rate-limit
```

2. **Helmet.js**: Add security headers
```bash
npm install helmet
```

3. **Input Sanitization**: Already implemented with express-validator

4. **CORS**: Configure properly for production

5. **Environment Secrets**: Never commit .env files

6. **Regular Updates**: Keep dependencies updated
```bash
npm audit
npm update
```

## Backup Strategy

### Database Backups

MongoDB Atlas provides automatic backups. For self-hosted:
```bash
# Create backup
mongodump --uri="mongodb://localhost:27017/vently" --out=/backup/

# Restore backup
mongorestore --uri="mongodb://localhost:27017/vently" /backup/vently/
```

### File Backups

Regularly backup uploaded files if using local storage.

## Post-Deployment

1. Test all features thoroughly
2. Monitor application logs
3. Set up alerts for errors
4. Monitor database performance
5. Check SSL certificate expiration
6. Regular security audits

## Troubleshooting

### Common Issues

**502 Bad Gateway**: Backend not running or wrong proxy configuration
**504 Gateway Timeout**: Backend taking too long to respond
**CORS Errors**: Check FRONTEND_URL and CORS configuration
**MongoDB Connection**: Verify connection string and IP whitelist

## Support

For deployment issues:
- Check logs: `pm2 logs` or platform-specific logs
- Review environment variables
- Verify network connectivity
- Check firewall rules

---

For more help, create an issue on [GitHub](https://github.com/nezerwafils/signature/issues).
