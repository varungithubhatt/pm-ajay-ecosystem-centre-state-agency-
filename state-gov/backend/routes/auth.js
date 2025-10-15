const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const StateUser = require('../models/StateUser');
const {
  signupValidationRules,
  loginValidationRules,
  validate
} = require('../middleware/validation');

router.post(
  '/signup',
  signupValidationRules(),
  validate,
  async (req, res) => {
    try {
      const { stateName, officialEmail, password, contactName, phone } = req.body;
      const exists = await StateUser.findOne({ officialEmail });
      if (exists) return res.status(409).json({ message: 'User already exists' });

      const user = new StateUser({ stateName, officialEmail, password, contactName, phone });
      await user.save();

      res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.post(
  '/login',
  loginValidationRules(),
  validate,
  async (req, res) => {
    try {
      const { officialEmail, password } = req.body;
      const user = await StateUser.findOne({ officialEmail });
      if (!user) return res.status(401).json({ message: 'Invalid email or password' });

      const validPassword = await user.comparePassword(password);
      if (!validPassword) return res.status(401).json({ message: 'Invalid email or password' });

      const payload = { id: user._id, email: user.officialEmail };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

      res.json({
        token,
        user: {
          stateName: user.stateName,
          officialEmail: user.officialEmail,
          contactName: user.contactName,
          phone: user.phone
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
