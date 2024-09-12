const BaseController = require('./baseController');
const Product = require('../models/Product');

class ProductController extends BaseController {
  // Add any custom methods if needed
}

module.exports = new ProductController(Product);
