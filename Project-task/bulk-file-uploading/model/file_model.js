const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconnection");

const File = sequelize.define("File", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mimetype: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filepath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uploaded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = File;
