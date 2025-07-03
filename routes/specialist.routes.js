const express = require("express");
const router = express.Router();
const {
  getHealthSpecialists,
} = require("../controllers/specialist.controller");

router.get("/specialist", getHealthSpecialists);

module.exports = router;

