const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
  const { email, password, password2 } = req.body;
  if (!email || !password || !password2)
    return res.status(400).json({ message: 'All fields are required.' });
  if (password !== password2)
    return res.status(400).json({ message: 'Passwords must match.' });
  if (await User.findOne({ email }))
    return res.status(400).json({ message: 'Email exists. Please log in.' });

  const user = new User({ email, password });
  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'All fields are required.' });

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(400).json({ message: 'Invalid credentials.' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
