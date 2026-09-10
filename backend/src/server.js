import express from 'express';
import routes from './routes/index.js';
import rateLimit from 'express-rate-limit';
import authRouter from './routes/auth.routes.js';

const app = express();
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'Too many request! Please try again later. '
  },
});

const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(globalLimiter);
app.use('/api', routes);
app.use("/api/auth", authRouter);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});