// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeDb');

const Role = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

Role.afterCreate(async () => {
  const roles = ['Admin', 'User'];
  for (const roleName of roles) {
    await Role.findOrCreate({
      where: { name: roleName },
      defaults: { name: roleName },
    });
  }
});

module.exports = Role;
