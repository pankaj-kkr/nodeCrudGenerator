// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

router.post('/', (req, res) => roleController.create(req, res)); //admin
router.get('/', (req, res) => roleController.read(req, res)); //admin
router.get('/:id', (req, res) => roleController.readById(req, res)); // admin user
router.put('/:id', (req, res) => roleController.update(req, res)); // admin user
router.delete('/:id', (req, res) => roleController.delete(req, res)); //admin

module.exports = router;
