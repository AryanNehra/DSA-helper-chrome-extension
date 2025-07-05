const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const hintsRoute = require('./router/hintsRouter')
const cors=require('cors');


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/hints', hintsRoute);


const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error('DB connection failed:', err));