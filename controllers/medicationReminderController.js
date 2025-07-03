const { MedicationsReminder } = require("../models/medicationsReminder");
const { TblUser } = require("../models/tblUserModel");
const { Op } = require("sequelize");

/**
 * @route POST /api/medications
 * @desc Add a new medication reminder
 */
const addMedicationReminder = async (req, res) => {
  try {
    const {
      user_id,
      store_id,
      doctor_id,
      name,
      dosage,
      period,
      times_per_day,
      times,
      drink_rule,
      start_date,
      duration,
      end_date,
      notes,
    } = req.body;

    // ✅ Basic validation
    if (!user_id || !doctor_id || !name || !start_date) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: user_id, doctor_id, name, start_date",
      });
    }

    // ✅ Optional: Validate if user exists
    const user = await TblUser.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Create the medication reminder
    const newReminder = await MedicationsReminder.create({
      user_id,
      store_id,
      doctor_id,
      name,
      dosage,
      period,
      times_per_day,
      times,
      drink_rule,
      start_date,
      duration,
      end_date,
      notes,
    });

    // ✅ Respond with created reminder
    return res.status(201).json({
      success: true,
      message: "Medication reminder created successfully",
      data: newReminder,
    });
  } catch (error) {
    console.error("Error creating medication reminder:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ GET: All medication reminders for a specific user
const getMedicationRemindersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Optional: Validate if user exists
    const user = await TblUser.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Fetch all reminders for the user
    const reminders = await MedicationsReminder.findAll({
      where: {
        user_id: userId,
        is_active: true,
      },
      attributes: [
        "medicationReminderId",
        "user_id",
        "store_id",
        "doctor_id",
        "name",
        "dosage",
        "period",
        "times_per_day",
        "times",
        "drink_rule",
        "start_date",
        "duration",
        "end_date",
        "notes",
      ],
      include: [
        {
          model: TblUser,
          as: "doctor",
          attributes: ["name"], // You can also include 'email', 'phone', etc.
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: `Found ${reminders.length} reminder(s) for user ${userId}`,
      data: reminders,
    });
  } catch (error) {
    console.error("Error fetching medication reminders:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateMedicationReminder = async (req, res) => {
  try {
    const {
      medicationReminderId,
      user_id,
      store_id,
      doctor_id,
      name,
      dosage,
      period,
      times_per_day,
      times,
      drink_rule,
      start_date,
      duration,
      end_date,
      notes,
    } = req.body;

    if (!medicationReminderId) {
      return res.status(400).json({
        success: false,
        message: "medicationReminderId is required",
      });
    }

    // ✅ Find the reminder
    const reminder = await MedicationsReminder.findByPk(medicationReminderId);
    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Medication reminder not found",
      });
    }

    // ✅ Update the reminder
    await reminder.update({
      user_id,
      store_id,
      doctor_id,
      name,
      dosage,
      period,
      times_per_day,
      times,
      drink_rule,
      start_date,
      duration,
      end_date,
      notes,
    });

    // ✅ Destructure and exclude unwanted fields
    const { is_active, created_at, updated_at, ...cleanedReminder } =
      reminder.toJSON();

    return res.status(200).json({
      success: true,
      message: "Medication reminder updated successfully",
      data: cleanedReminder,
    });
  } catch (error) {
    console.error("Error updating reminder:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getActiveMedicationsByUserAndDate = async (req, res) => {
  try {
    const userId = req.params.userId;
    const targetDate = req.query.date || new Date().toISOString().split("T")[0]; // Default: today

    // Optional: check if user exists
    const user = await TblUser.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Only include specific fields
    const reminders = await MedicationsReminder.findAll({
      where: {
        user_id: userId,
        is_active: true,
        start_date: { [Op.lte]: targetDate },
        end_date: { [Op.gte]: targetDate },
      },
      attributes: [
        "medicationReminderId",
        "user_id",
        "store_id",
        "doctor_id",
        "name",
        "dosage",
        "period",
        "times_per_day",
        "times",
        "drink_rule",
        "start_date",
        "duration",
        "end_date",
        "notes",
      ],
      order: [["start_date", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: `Found ${reminders.length} active medication(s) for user ${userId} on ${targetDate}`,
      data: reminders,
    });
  } catch (error) {
    console.error("Error fetching medications by date:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteMedicationReminder = async (req, res) => {
  try {
    const reminderId = req.params.medicationReminderId;

    const reminder = await MedicationsReminder.findByPk(reminderId);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Medication reminder not found",
      });
    }

    // ❌ Hard delete
    await reminder.destroy();

    return res.status(200).json({
      success: true,
      message: "Medication reminder deleted permanently",
    });
  } catch (error) {
    console.error("Error deleting medication reminder:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  addMedicationReminder,
  getMedicationRemindersByUserId,
  updateMedicationReminder,
  getActiveMedicationsByUserAndDate,
  deleteMedicationReminder,
};
