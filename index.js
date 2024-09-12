// const app = require('express')();
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/docs/swagger.json');

require('dotenv').config();
const sequelize = require('./src/config/sequelizeDb');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./src/middleware/errorMiddleware');

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

// app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', require('./src/routes/authRoutes'));
app.use('/api', require('./src/routes'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
  const error = new Error('Route Not Found');
  res.status(404);
  next(error);
});
app.use(errorHandler);
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // await sequelize.sync({ alter: true });

    // Sync all defined models to the DB
    await sequelize.sync();
    console.log('All models were synchronized successfully.');

    app.listen(PORT, () => {
      console.log('Server is running on port ' + PORT);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
