const BaseController = require('./baseController');
const User = require('../models/User');
const Role = require('../models/Role');
const { Sequelize } = require('sequelize');

class UserController extends BaseController {
  read = async (req, res) => {
    const items = await this.model.findAll({
      include: [{ model: Role, as: 'role', attributes: ['name'] }],
    });
    res.status(200).json(items);
  };

  readById = async (req, res) => {
    const item = await this.model.findByPk(req.params.id, {
      include: [{ model: Role, as: 'role', attributes: ['name'] }],
    });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(item);
  };
}

module.exports = new UserController(User);
