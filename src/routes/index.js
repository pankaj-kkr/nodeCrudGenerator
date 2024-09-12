// routes/index.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

router.use('/users', authMiddleware, require('./userRoutes'));
router.use('/roles', require('./roleRoutes'));

router.use('/projects', authMiddleware, require('./projectRoutes'));
router.use('/products', authMiddleware, require('./productRoutes'));

module.exports = router;
