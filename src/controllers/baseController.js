class BaseController {
  constructor(model) {
    this.model = model;
  }

  // async create(req, res) {
  //   try {
  //     const item = await this.model.create(req.body);
  //     res.status(201).json(item);
  //   } catch (err) {
  //     if (
  //       err.name === 'SequelizeValidationError' ||
  //       err.name === 'SequelizeUniqueConstraintError'
  //     ) {
  //       const validationErrors = err.errors.map((error) => ({
  //         field: error.path,
  //         message: error.message,
  //       }));
  //       return res.status(400).json({ errors: validationErrors });
  //     }

  //     res.status(400).json({ error: err.message });
  //   }
  // }

  create = async (req, res, next) => {
    const item = await this.model.create(req.body);
    res.status(201).json(item);
  };

  read = async (req, res) => {
    try {
      const items = await this.model.findAll();
      res.status(200).json(items);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  readById = async (req, res, param = null) => {
    try {
      const item = await this.model.findByPk(req.params.id, param);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.status(200).json(item);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  update = async (req, res) => {
    try {
      const item = await this.model.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      await item.update(req.body);
      res.status(200).json(item);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  delete = async (req, res) => {
    try {
      const item = await this.model.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      await item.destroy();
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
}

module.exports = BaseController;
