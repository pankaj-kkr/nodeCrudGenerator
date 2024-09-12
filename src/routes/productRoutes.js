const express = require('express');
const router = express.Router();
const multer = require('multer');
const { restrict } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');
const productController = require('../controllers/productController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
router.post('/', restrict(['Admin']), asyncHandler(productController.create));
router.get('/', restrict(['Admin']), asyncHandler(productController.read));
router.get(
  '/:id',
  restrict(['Admin']),
  asyncHandler(productController.readById)
);
router.put('/:id', restrict(['Admin']), asyncHandler(productController.update));
router.delete(
  '/:id',
  restrict(['Admin']),
  asyncHandler(productController.delete)
);

router.post(
  '/product-image',
  upload.single('image'),
  function (req, res, next) {
    console.log(JSON.stringify(req.file));
    return res.send('uploaded');
  }
);

module.exports = router;
