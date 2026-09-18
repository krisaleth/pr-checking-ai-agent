import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.routes.js';
import authRouter from './routes/auth.routes.js';
import connectDB from './config/database.js';
import session from 'express-session';

const app = express();
const PORT = process.env.PORT || 3000;

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests! Please try again later.' },
});

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 10 * 60 * 1000 },
}));
app.use(globalLimiter);

// Auth trước, routes sau
app.use('/api/auth', authRouter);
app.use('/api', routes);

app.get('/', (req, res) => res.send('Hello, World!'));

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

try {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch (err) {
  console.error('Failed to start:', err.message);
  process.exit(1);
}   