const express = require('express');
const router = express.Router();
const { restrict } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');
const projectController = require('../controllers/projectController');

router.post('/', restrict(['Admin']), asyncHandler(projectController.create));
router.get('/', asyncHandler(projectController.read));
router.get(
  '/:id',
  restrict(['Admin']),
  asyncHandler(projectController.readById)
);
router.put('/:id', restrict(['Admin']), asyncHandler(projectController.update));
router.delete(
  '/:id',
  restrict(['Admin']),
  asyncHandler(projectController.delete)
);

module.exports = router;
