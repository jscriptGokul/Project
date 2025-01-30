const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define("Message", {
    id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
    timestamp: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { tableName: "messages", timestamps: false });

module.exports = Message;
