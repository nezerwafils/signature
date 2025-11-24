# Security Guidelines for Vently

This document outlines security considerations and best practices for the Vently application.

## Environment Configuration

### Required Environment Variables

**CRITICAL:** The following environment variables MUST be set in production:

```bash
JWT_SECRET=<strong-random-string-minimum-32-characters>
MONGODB_URI=<your-production-mongodb-connection-string>
NODE_ENV=production
```

### Generating Secure JWT Secret

Use a cryptographically secure random string:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Security Features Implemented

### 1. Authentication & Authorization

- ✅ **Password Hashing**: Bcrypt with salt rounds (10)
- ✅ **JWT Tokens**: Signed tokens with 30-day expiration
- ✅ **Token Validation**: Middleware validates all protected routes
- ✅ **Session Management**: Stateless JWT-based authentication

### 2. Input Validation

- ✅ **Username Validation**: 
  - Must start with a letter
  - 3-30 characters
  - Only letters, numbers, and underscores
  - Reserved names blocked (admin, root, system, etc.)

- ✅ **Password Requirements**:
  - Minimum 6 characters
  - Hashed before storage
  - Never exposed in API responses

- ✅ **Email Validation**: 
  - Optional field
  - Valid email format required if provided

### 3. File Upload Security

- ✅ **File Size Limit**: 10MB maximum
- ✅ **MIME Type Validation**: Only audio files accepted
- ✅ **File Extension Check**: Additional validation layer

**⚠️ Important Note:** 
The current MIME type validation relies on the declared file type. For enhanced security in production:

```javascript
// Consider using a library like 'file-type' to check actual file headers
const FileType = require('file-type');

const validateAudioFile = async (buffer) => {
  const type = await FileType.fromBuffer(buffer);
  return type && type.mime.startsWith('audio/');
};
```

### 4. Rate Limiting

- ✅ **API Rate Limiting**: 100 requests per 15 minutes per IP
- ✅ **Configurable Limits**: Adjust based on your needs

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### 5. HTTP Security Headers

Implemented using Helmet.js:

- ✅ Content Security Policy
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ Strict-Transport-Security
- ✅ X-XSS-Protection

### 6. CORS Configuration

Default configuration allows all origins in development. **Must be restricted in production:**

```javascript
// Production CORS configuration
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true
}));
```

### 7. Database Security

- ✅ **MongoDB Injection Prevention**: Mongoose sanitizes queries
- ✅ **Index Optimization**: Proper indexing for performance
- ✅ **Connection Security**: Use MongoDB Atlas or SSL connections

## Security Recommendations

### For Production Deployment

1. **Environment Variables**
   - Never commit `.env` files
   - Use secret management services (AWS Secrets Manager, HashiCorp Vault)
   - Rotate JWT secrets periodically

2. **HTTPS Required**
   - Use SSL/TLS certificates (Let's Encrypt recommended)
   - Enforce HTTPS for all connections
   - Configure HSTS headers

3. **File Storage**
   - Consider moving to cloud storage (AWS S3, Cloudinary)
   - Implement virus scanning for uploaded files
   - Set proper access controls on storage buckets

4. **Database**
   - Enable MongoDB authentication
   - Use strong passwords
   - Restrict network access with firewall rules
   - Enable audit logging
   - Regular backups

5. **Rate Limiting**
   - Implement more granular rate limits
   - Add rate limiting per user
   - Consider using Redis for distributed rate limiting

6. **Logging & Monitoring**
   - Log all authentication attempts
   - Monitor for suspicious activity
   - Set up alerts for anomalies
   - Use a centralized logging service

7. **Dependencies**
   - Regularly update dependencies
   - Run `npm audit` regularly
   - Subscribe to security advisories
   - Use Snyk or similar for vulnerability scanning

## Known Security Considerations

### 1. Multer Version

The project uses multer 1.x which has known vulnerabilities. Recommendations:

- Monitor for multer 2.x release
- Implement additional file validation
- Consider alternative upload solutions for production
- Scan uploaded files with antivirus

### 2. MediaRecorder API

Browser-specific audio formats may vary:

- Chrome: webm
- Safari: mp4
- Firefox: webm/ogg

Handle format detection:

```javascript
const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
  ? 'audio/webm' 
  : 'audio/mp4';
```

### 3. MIME Type Spoofing

Current file validation checks declared MIME type only. For production:

- Implement file header validation
- Use dedicated file type detection libraries
- Scan files for malware
- Validate audio duration and format

## Security Checklist for Deployment

- [ ] JWT_SECRET set with strong random value
- [ ] MongoDB authentication enabled
- [ ] HTTPS/SSL configured
- [ ] CORS restricted to allowed domains
- [ ] Rate limiting properly configured
- [ ] File uploads moved to cloud storage
- [ ] Virus scanning implemented
- [ ] Logging and monitoring set up
- [ ] Dependencies updated and audited
- [ ] Backup strategy implemented
- [ ] Security headers verified
- [ ] Error messages don't leak sensitive info

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** open a public issue
2. Email security concerns privately
3. Include detailed description and reproduction steps
4. Allow time for patch before public disclosure

## Compliance Considerations

### GDPR (if serving EU users)

- ✅ User can delete their account
- ✅ Minimal data collection (email optional)
- ⚠️ Add data export functionality
- ⚠️ Add privacy policy
- ⚠️ Add cookie consent

### COPPA (if allowing users under 13)

- ⚠️ Age verification required
- ⚠️ Parental consent mechanisms
- ⚠️ Enhanced privacy protections

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

---

**Security is an ongoing process. Regularly review and update these practices.**
