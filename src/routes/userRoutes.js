// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { restrict } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

router.post('/', restrict(['Admin']), asyncHandler(userController.create));
router.get('/', restrict(['Admin']), asyncHandler(userController.read));
router.get(
  '/:id',
  restrict(['Admin', 'User'], true, User),
  asyncHandler(userController.readById)
);
router.put(
  '/:id',
  restrict(['Admin', 'User'], true, User),
  asyncHandler(userController.update)
);
router.delete('/:id', restrict(['Admin']), asyncHandler(userController.delete));

module.exports = router;
