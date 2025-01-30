const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");

const User = sequelize.define("User", {
    id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
}, { tableName: "users", timestamps: false });



module.exports = User;
