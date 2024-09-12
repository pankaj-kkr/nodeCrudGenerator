const BaseController = require('./baseController');
const Project = require('../models/Project');

class ProjectController extends BaseController {
  // Add any custom methods if needed
}

module.exports = new ProjectController(Project);
