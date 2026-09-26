import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.routes.js';
import authRouter from './routes/auth.routes.js';
import { connectDatabase } from './config/database.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import githubWebhookRouter from './routes/github.webhook.routes.js';
import adminRouter from './routes/admin.routes.js';

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests! Please try again later.' },
});

app.use(
  '/api/github',
  express.raw({ type: 'application/json' }),
  githubWebhookRouter
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 10 * 60 * 1000 },
}));
app.use(globalLimiter);

app.use(cookieParser());
app.use('/admin', adminRouter);
app.use('/api/auth', authRouter);
app.use('/api', routes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

try {
  await connectDatabase();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch (err) {
  console.error('Failed to start:', err.message);
  process.exit(1);
}   