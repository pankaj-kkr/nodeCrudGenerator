const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    return await mongoose.connect(process.env.DB_CONNECTION);
  } catch (error) {
    console.log('DB connection Error', error);
    process.exit(1);
  }
};

module.exports = connectDB;
