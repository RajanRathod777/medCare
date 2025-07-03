const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

// DB Connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);
const Specialist = sequelize.define(
  "Specialist",
  {
    specialistId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    image: {
      type: DataTypes.STRING(255),
    },
    specialty: {
      type: DataTypes.STRING(255),
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "specialist",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);


module.exports = { Specialist };
