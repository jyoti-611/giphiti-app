const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const configJson = require("../config/config");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

const config = configJson[env];

console.log("this is the environment: ", env);

const db = {};

const dbConfig = require("../config/config");
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: "mysql",
    operatorsAliases: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);
db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = db;
