require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define routes
app.use('/api/invoices', require('./routes/invoices'));

// Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));


  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
// }

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
