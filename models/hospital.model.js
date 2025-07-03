const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

// Import Specialist from another file
const { Specialist } = require("./specialist.models");

// DB connection (shared instance)
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

// Hospital model
const HospitalsNormalized = sequelize.define(
  "HospitalsNormalized",
  {
    id: {
      type: DataTypes.STRING(30),
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(255), allowNull: false },
    logo: { type: DataTypes.TEXT },
    image: { type: DataTypes.TEXT },
    address: { type: DataTypes.TEXT, allowNull: false },
    phone: { type: DataTypes.STRING(20) },
    phoneCode: { type: DataTypes.STRING(5) },
    country: { type: DataTypes.STRING(255) },
    state: { type: DataTypes.STRING(255) },
    city: { type: DataTypes.STRING(255) },
    locationLink: { type: DataTypes.TEXT },
    latitude: { type: DataTypes.DECIMAL(10, 8) },
    longitude: { type: DataTypes.DECIMAL(11, 8) },
    zoom_level: { type: DataTypes.INTEGER, defaultValue: 15 },
    entrance_lat: { type: DataTypes.DECIMAL(10, 8) },
    entrance_lng: { type: DataTypes.DECIMAL(11, 8) },
    website: { type: DataTypes.STRING(255) },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    reank: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: "hospitals_normalized",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// HospitalSpecialties model
const HospitalSpecialties = sequelize.define(
  "HospitalSpecialties",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    hospital_id: {
      type: DataTypes.STRING(100),
      references: { model: HospitalsNormalized, key: "id" },
      onDelete: "CASCADE",
    },
    doctor_id: {
      type: DataTypes.STRING(255),
      defaultValue: "0", 
    },
    specialty: { type: DataTypes.STRING(255) },
    specialistId: {
      type: DataTypes.INTEGER,
      references: { model: Specialist, key: "specialistId" },
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "hospital_specialties",
    timestamps: false,
    indexes: [{ name: "idx_hospital_specialty", fields: ["hospital_id", "specialty"] }],
  }
);

// HospitalRoomTypes model
const HospitalRoomTypes = sequelize.define(
  "HospitalRoomTypes",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    hospital_id: {
      type: DataTypes.STRING(100),
      references: { model: HospitalsNormalized, key: "id" },
      onDelete: "CASCADE",
    },
    room_type: { type: DataTypes.STRING(100) },
    totalBed: { type: DataTypes.INTEGER },
    availableBed: { type: DataTypes.INTEGER },
    description: { type: DataTypes.TEXT },
    note: { type: DataTypes.TEXT },
    pricePerNight: { type: DataTypes.DECIMAL(10, 2) },
    currency: { type: DataTypes.STRING(3) },
  },
  {
    tableName: "hospital_room_types",
    timestamps: false,
    indexes: [{ name: "idx_hospital_room", fields: ["hospital_id", "room_type"] }],
  }
);

// Relationships
HospitalsNormalized.hasMany(HospitalSpecialties, { foreignKey: "hospital_id" });
HospitalSpecialties.belongsTo(HospitalsNormalized, { foreignKey: "hospital_id" });

HospitalsNormalized.hasMany(HospitalRoomTypes, { foreignKey: "hospital_id" });
HospitalRoomTypes.belongsTo(HospitalsNormalized, { foreignKey: "hospital_id" });

Specialist.hasMany(HospitalSpecialties, { foreignKey: "specialistId" });
HospitalSpecialties.belongsTo(Specialist, { foreignKey: "specialistId" });

// Export everything
module.exports = {
  sequelize,
  Specialist,
  HospitalsNormalized,
  HospitalSpecialties,
  HospitalRoomTypes,
};
