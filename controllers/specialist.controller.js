const { Specialist } = require("../models/specialist.models");

exports.getHealthSpecialists = async (req, res) => {
  try {
    const Specialists = await Specialist.findAll({
      attributes: ["specialistId", "image", "specialty"]
    });

    res.status(200).json({
      Specialists
    });

  } catch (err) {
    console.error("Error fetching healthSpecialist:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
