const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());
app.use(cors());


mongoose.connect('mongodb://localhost:27017/hrm', { useNewUrlParser: true });

const User = mongoose.model('User', {
  firstname: String,
  lastname: String,
  email: String,
  passwordHash: String,
  phonenumber: String
});

function generateAccessToken(user) {
  return jwt.sign(user, 'secret');
}

// Hashing function using Node.js crypto module
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

app.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, password,phonenumber } = req.body;
    const passwordHash = hashPassword(password);
    const user = new User({ firstname, lastname, email, passwordHash,phonenumber });
    await user.save();
    const token = generateAccessToken({ firstname, email });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering new user.');
  }
});





app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found.');
    }
    // Compare hashed password
    if (user.passwordHash !== hashPassword(password)) {
      return res.status(401).send('Invalid password.');
    }
    const token = generateAccessToken({ firstname: user.firstname, email });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error logging in.');
  }

});

// Define your Mongoose model (replace with your data structure)
const ItemSchema = new mongoose.Schema({
  Employee_ID: {
    type: String,
    required: true
  },
  First_Name: String,
  Last_Name: String,
  Email: String,
  Phone_Number: String,
  Date_of_Birth: String,
  Address: String,
  Department: String,
  Position_Job_Title: String,
  Date_Hired: String,
  Salary: String


});

const Item = mongoose.model('Item', ItemSchema);

// CRUD API endpoints

// Create
app.post('/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Read
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update
app.put('/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).send('Item not found');
    }
    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete
app.delete('/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).send('Item not found');
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});










app.listen(3000, () => {
  console.log('Server running on port 3000');
});
