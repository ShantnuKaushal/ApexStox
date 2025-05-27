const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ tracked: user.tracked });
});

router.post('/', auth, async (req, res) => {
  const { symbol } = req.body;
  const user = await User.findById(req.user.id);
  const idx = user.tracked.indexOf(symbol);
  if (idx === -1) user.tracked.push(symbol);
  else user.tracked.splice(idx, 1);
  await user.save();
  res.json({ tracked: user.tracked });
});

module.exports = router;
