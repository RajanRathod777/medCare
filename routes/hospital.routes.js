// routes/hospitalRoutes.js
const express = require('express');
const {
  getAllHospital,
  getHospitalById,
  findHospitals,
} = require('../controllers/hospitalController');

const router = express.Router();

router.get('/hospitals/:page',getAllHospital);
router.get('/hospital/:hospitalId', getHospitalById);
router.get("/find/hospitals/:page", findHospitals);

// router.get('/hospitals/:hospitalId/map-data', getHospitalMapData);


// router.post('/hospitals', addHospital);
// router.post('/hospitals/:hospitalId/specialties', addHospitalSpecialties);
// router.post('/hospitals/:hospitalId/room-types', addHospitalRoomTypes);

module.exports = router;