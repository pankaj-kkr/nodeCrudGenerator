const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeDb');

const Author = sequelize.define(
  'Author',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    timestamps: true,
  }
);

    Author.hasMany(Post, {
      foreignKey: 'userId',
    });

module.exports = Author;
