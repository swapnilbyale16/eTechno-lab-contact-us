const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/contactForm', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Schema & Model
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String
});
const Contact = mongoose.model('Contact', ContactSchema);

// API Routes
app.post('/submit', async (req, res) => {
  try {
    const newEntry = new Contact(req.body);
    await newEntry.save();
    const entries = await Contact.find();
    res.status(201).json({ message: 'Form submitted successfully', entries });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/entries', async (req, res) => {
  try {
    const entries = await Contact.find();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
