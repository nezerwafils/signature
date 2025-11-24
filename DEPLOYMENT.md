# Vently Deployment Guide

This guide covers deploying Vently to production.

## Production Checklist

### Environment Variables
Create a `.env` file with production values:

```env
PORT=5000
MONGODB_URI=mongodb://your-production-db-url/vently
JWT_SECRET=your-strong-random-secret-key-here
NODE_ENV=production
```

### Security Considerations

1. **JWT Secret**: Use a strong, random secret (minimum 32 characters)
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **MongoDB**: 
   - Use MongoDB Atlas or a managed service
   - Enable authentication
   - Use connection string with credentials
   - Enable SSL/TLS

3. **CORS**: Update CORS settings in `server/index.js` for your domain

4. **Rate Limiting**: Adjust rate limits based on your needs

5. **File Uploads**: Consider using cloud storage (AWS S3, Cloudinary) instead of local storage

## Deployment Options

### Option 1: Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   heroku create vently-app
   ```

4. **Add MongoDB**
   ```bash
   heroku addons:create mongolab
   ```

5. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set NODE_ENV=production
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 2: Deploy to VPS (DigitalOcean, AWS EC2, etc.)

1. **Setup Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Clone and Setup**
   ```bash
   git clone https://github.com/nezerwafils/signature.git
   cd signature
   npm run install-all
   ```

3. **Build Frontend**
   ```bash
   cd client
   npm run build
   cd ..
   ```

4. **Configure Environment**
   ```bash
   cp .env.example .env
   nano .env  # Edit with production values
   ```

5. **Start with PM2**
   ```bash
   pm2 start server/index.js --name vently
   pm2 startup
   pm2 save
   ```

6. **Setup Nginx (Reverse Proxy)**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/vently
   ```
   
   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
   
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   sudo ln -s /etc/nginx/sites-available/vently /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### Option 3: Deploy to Vercel (Frontend) + Heroku (Backend)

**Frontend (Vercel):**
1. Push code to GitHub
2. Import project to Vercel
3. Set build command: `cd client && npm run build`
4. Set output directory: `client/build`
5. Add environment variable: `REACT_APP_API_URL=your-backend-url`

**Backend (Heroku):**
Follow Option 1 steps

### Option 4: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm install --production
   
   COPY server ./server
   COPY client/build ./client/build
   
   EXPOSE 5000
   
   CMD ["node", "server/index.js"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   
   services:
     mongodb:
       image: mongo:6
       volumes:
         - mongo-data:/data/db
       environment:
         MONGO_INITDB_ROOT_USERNAME: admin
         MONGO_INITDB_ROOT_PASSWORD: password
   
     app:
       build: .
       ports:
         - "5000:5000"
       depends_on:
         - mongodb
       environment:
         MONGODB_URI: mongodb://admin:password@mongodb:27017/vently?authSource=admin
         JWT_SECRET: your-secret-key
         NODE_ENV: production
   
   volumes:
     mongo-data:
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

## Monitoring

### Setup PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Health Checks
Monitor `/api/health` endpoint for uptime

## Backup Strategy

1. **MongoDB Backups**
   ```bash
   # Create backup
   mongodump --uri="mongodb://localhost:27017/vently" --out=/backup/$(date +%Y%m%d)
   
   # Restore backup
   mongorestore --uri="mongodb://localhost:27017/vently" /backup/20240101
   ```

2. **Automated Backups**
   Setup cron job:
   ```bash
   0 2 * * * mongodump --uri="mongodb://localhost:27017/vently" --out=/backup/$(date +\%Y\%m\%d)
   ```

## Performance Optimization

1. **Enable Compression**: Already included in Express setup
2. **CDN**: Use CDN for static assets
3. **Caching**: Implement Redis for session/cache
4. **Database Indexing**: Already configured in models
5. **Load Balancing**: Use Nginx or cloud load balancer

## Scaling Considerations

1. **Horizontal Scaling**: Deploy multiple instances behind load balancer
2. **Database Sharding**: For large user bases
3. **Media Storage**: Move to S3/Cloudinary
4. **Caching Layer**: Add Redis for frequently accessed data
5. **Queue System**: Use Bull/RabbitMQ for background jobs

## Troubleshooting

### Common Issues

**Issue**: Cannot connect to MongoDB
**Solution**: Check MongoDB is running, verify connection string

**Issue**: File upload fails
**Solution**: Check disk space, verify upload directory permissions

**Issue**: CORS errors
**Solution**: Update CORS configuration in server/index.js

**Issue**: High memory usage
**Solution**: Implement pagination, add caching, optimize queries

## Maintenance

### Updates
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Rebuild frontend
cd client && npm run build && cd ..

# Restart server
pm2 restart vently
```

### Database Migrations
Run migration scripts before deploying new versions with schema changes

## Support

For issues or questions, please open an issue on GitHub.
