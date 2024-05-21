const { Sequelize } = require("sequelize");

const sequelizE = new Sequelize(
  "postgresql://postgres:biiUYgBjcpIbpzxysDEOSimhWqfuYPVO@roundhouse.proxy.rlwy.net:22954/railway"
); // Example for postgres

module.exports = {
  sequelize: sequelizE,
};
