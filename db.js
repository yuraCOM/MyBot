const { Sequelize } = require("sequelize");

const sequelizE = new Sequelize(
  "postgresql://postgres:eSliXRnQaoWfBTzLCaXEsWFJVXBKzqBX@viaduct.proxy.rlwy.net:37902/railway"
); // Example for postgres

module.exports = {
  sequelize: sequelizE,
};
