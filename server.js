const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

let authUsers = [];
let regularUsers = [];

const initializeUsers = async () => {
  authUsers.push({ username: 'haulmatic', password: await hashPassword('123456') });
};
initializeUsers();

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, 'secretKey');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = authUsers.find((u) => u.username === username);
  if (!user) return res.status(400).json({ message: 'User not found' });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

  const token = jwt.sign({ username: user.username }, 'secretKey', { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

app.get('/users', authenticate, (req, res) => {
  res.json(regularUsers);
});

app.post('/users', authenticate, (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) return res.status(400).json({ message: 'Invalid data' });

  const newUser = { id: Date.now(), firstName, lastName };
  regularUsers.push(newUser);
  res.status(201).json(newUser);
});

app.put('/users/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const { firstName, lastName } = req.body;

  const user = regularUsers.find((u) => u.id === parseInt(id));
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  res.json(user);
});

app.delete('/users/:id', authenticate, (req, res) => {
  const { id } = req.params;
  regularUsers = regularUsers.filter((u) => u.id !== parseInt(id));
  res.json({ message: 'User deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;