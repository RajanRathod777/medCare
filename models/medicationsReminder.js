// medicationsReminderModel.js
const { DataTypes } = require("sequelize");
const { sequelize, TblUser } = require("./tblUserModel"); // Import from models.js

// ✅ Define MedicationsReminder model
const MedicationsReminder = sequelize.define("MedicationsReminder", {
    medicationReminderId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    store_id: { type: DataTypes.INTEGER },
    doctor_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(100), allowNull: false },
    dosage: { type: DataTypes.STRING(50) },
    period: { type: DataTypes.ENUM("Every Day", "Every Alternate Day", "Custom") },
    times_per_day: { type: DataTypes.INTEGER },
    times: { type: DataTypes.JSON },
    drink_rule: { type: DataTypes.ENUM("Before Meals", "After Meals", "With Meals") },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    duration: { type: DataTypes.STRING(20) },
    end_date: { type: DataTypes.DATEONLY },
    notes: { type: DataTypes.TEXT },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    tableName: "medications_reminder",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

// ✅ Set up associations
TblUser.hasMany(MedicationsReminder, {
    foreignKey: "user_id",
    as: "medications",
    onDelete: "CASCADE",
});
MedicationsReminder.belongsTo(TblUser, {
    foreignKey: "user_id",
    as: "user",
});

// ✅ Export
module.exports = {
    MedicationsReminder,
};
