const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeDb');

const Post = sequelize.define(
  'Post',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    timestamps: true,
  }
);

    Post.belongsTo(User, {
      foreignKey: 'userId',
    });

module.exports = Post;
