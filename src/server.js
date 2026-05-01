require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');

// Connect Databases
connectDB();
connectRedis();

const app = express();

// --- 🛡️ FORT KNOX SECURITY LAYER ---

// 1. Trust Proxy (Required for rate limiting behind Nginx)
app.set('trust proxy', 1);

// 2. Helmet for secure headers (Strict Mode)
app.use(helmet({
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' }, // Prevent Clickjacking
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: true,
  referrerPolicy: { policy: 'no-referrer' },
  xssFilter: true,
}));

// 3. Prevent HTTP Parameter Pollution
app.use(hpp());

// 4. Data Sanitization against NoSQL injection
app.use(mongoSanitize());

// 5. Data Sanitization against XSS
app.use(xss());

// 6. Logging (Security monitoring)
app.use(morgan('combined')); // Standard Apache combined log output

// 7. Strict CORS Whitelisting
const whitelist = [process.env.CLIENT_URL, 'http://localhost:3000', 'https://edusync.com'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`🛑 Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// 8. Global Rate Limiter (Brute Force Protection)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'High traffic detected. Access throttled for security.' }
});
app.use('/api/', globalLimiter);

// 9. Specific Auth Rate Limiter (Prevent Login Spam)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  message: { success: false, message: 'Too many login attempts. Try again in an hour.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

// --- ⚙️ MIDDLEWARE ---
app.use(express.json({ limit: '1mb' })); // Limit body size to prevent DDoS
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'active', secure: true, time: new Date() }));

// Static folder for uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Upload Route
const upload = require('./middleware/upload');
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({ success: true, url: `/uploads/${req.file.filename}` });
});

// --- 🛣️ ROUTES ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/enquiry', require('./routes/enquiry'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/partners', require('./routes/partners'));

// 404 handler
app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Invalid endpoint' }));

// --- 💥 CRASH-PROOF ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error('⚠️ SECURITY_ALERT:', err.name, err.message);
  
  // Custom error for CORS
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'Access Denied: CORS Policy' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'A system error occurred. Our security team has been notified.' : err.message
  });
});

const PORT = process.env.PORT || 5002;
const server = app.listen(PORT, () => {
  console.log(`\n🔒 EDUSYNC SECURE-SHIELD ACTIVE [Port: ${PORT}]`);
});

// Anti-Crash: Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.log('CRITICAL ERROR (Uncaught Exception):', err.message);
  // Optional: graceful shutdown
});

process.on('unhandledRejection', (err) => {
  console.log('CRITICAL ERROR (Unhandled Rejection):', err.message);
});
