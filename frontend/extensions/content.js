const express = require('express');
const cors = require('cors');
require('dotenv').config();
const hintsRoute = require('./router/hintsRouter');

const app = express();

const allowedOrigins = [
  'https://leetcode.com',
  'https://www.leetcode.com',
  'https://www.geeksforgeeks.org',
  'https://practice.geeksforgeeks.org',
  'https://www.hackerrank.com',
  'https://codeforces.com',
  'https://www.codeforces.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use('/api/hints', hintsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
