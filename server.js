require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

// 1. Connect to MongoDB Atlas
connectDB();

app.set('trust proxy', 1); 

// 2. Middleware
app.use(helmet());
app.use(express.json());


const allowedOrigins = [
  'http://localhost:5500', 
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'https://unscriptedpitch.in',      // Production Domain
  'https://www.unscriptedpitch.in'   // Production Domain (WWW)
];

app.use(cors({
  origin: function (origin, callback) {
      // Allow server-to-server or non-browser requests 
      if (!origin) return callback(null, true);
      
      const isWhitelisted = allowedOrigins.indexOf(origin) !== -1;
      const isEnvFrontend = process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL;
      const isDevelopment = process.env.NODE_ENV !== 'production';

      if (isWhitelisted || isEnvFrontend || isDevelopment) {
          callback(null, true);
      } else {
          console.warn(`CORS Blocked: ${origin}`);
          callback(new Error('Access Denied by Security Policy (CORS)'));
      }
  },
  credentials: true
}));

// 3. Routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  standardHeaders: true, 
  legacyHeaders: false,
  message: { message: "Too many requests. Registration throttled for 15 minutes." }
});

app.use('/api/apply', apiLimiter, require('./routes/apply'));
app.use('/api/auth', require('./routes/auth')); 
app.use('/api/admin', require('./routes/admin'));

// 4. Global Health Check 
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'Online', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 5. Start Server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {

    if (process.env.NODE_ENV !== 'production') {
        console.log(`
        --------------------------------------------------
        🚀 UNSRIPTED PITCH API - ACTIVE
        📡 Port: ${PORT}
        🌐 Environment: Development
        --------------------------------------------------
        `);
    } else {
        console.log(`[PRODUCTION] Server initialized on port ${PORT}`);
    }
});


module.exports = app;