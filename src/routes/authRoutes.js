const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

const {
  login,
  refreshToken,
  logout,
} = require('../controllers/authController');

router.post('/login', login);
router.get('/token', authMiddleware, refreshToken);
router.get('/logout', logout);

module.exports = router;
