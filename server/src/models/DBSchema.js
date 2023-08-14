const { sequelize, Sequelize } = require("./index");

sequelize.define(
  "Session",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    ShopName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    AccessToken: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    OwnerName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    OwnerEmail: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Session",
  }
);

module.exports = sequelize.models;
