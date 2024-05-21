const { sequelize } = require("./db");
const { DataTypes } = require("sequelize");

const user = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  chatId: { type: DataTypes.BIGINT, unique: true },
  right: { type: DataTypes.INTEGER, defaultValue: 0 },
  wrong: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = {
  UserModel: user,
};
