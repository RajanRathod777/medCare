const express = require('express');
const router = express.Router();

const {
    addMedicationReminder,
    getMedicationRemindersByUserId,
    updateMedicationReminder,
    getActiveMedicationsByUserAndDate,
    deleteMedicationReminder,
} = require('../controllers/medicationReminderController');

// ✅ POST /api/medications
router.get('/medications_reminder/:userId', getMedicationRemindersByUserId);
router.get('/active/medications_reminder/:userId', getActiveMedicationsByUserAndDate);
router.post('/medications_reminder', addMedicationReminder);
router.put('/medications_reminder', updateMedicationReminder);
router.delete('/medications_reminder/:medicationReminderId', deleteMedicationReminder);


module.exports = router;
