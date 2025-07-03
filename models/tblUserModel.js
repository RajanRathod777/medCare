// models.js
const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

// ✅ Initialize Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false,
    }
);

// ✅ Define TblUser model
const TblUser = sequelize.define("TblUser", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100) },
    email: { type: DataTypes.STRING(100), unique: true },
    phone: { type: DataTypes.STRING(15), unique: true },
    gender: { type: DataTypes.STRING(10) },
    dob: { type: DataTypes.DATEONLY },
    password: { type: DataTypes.STRING(255) },
    role: {
        type: DataTypes.ENUM("admin", "doctor", "patient"),
        defaultValue: "patient",
    },
    status_flag: { type: DataTypes.TINYINT, defaultValue: 1 },
    isNotify: { type: DataTypes.TINYINT, defaultValue: 0 },
    otp: { type: DataTypes.STRING(6) },
    otp_expire_time: { type: DataTypes.DATE },
    isVerify: { type: DataTypes.TINYINT, defaultValue: 0 },
    create_user: { type: DataTypes.INTEGER },
    update_user: { type: DataTypes.INTEGER },
}, {
    tableName: "tbl_user",
    timestamps: true,
    createdAt: "create_date",
    updatedAt: "update_date",
});

// ✅ Export
module.exports = {
    sequelize,
    TblUser,
};
