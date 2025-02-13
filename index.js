require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./schema');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Error connecting to database:', err));

// POST Endpoint
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.validate(); // Validate before saving
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
