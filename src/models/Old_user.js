const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String, required: [true, 'username required'] },
  password: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: Number, required: true },
});

module.exports = mongoose.model('Users', userSchema);
