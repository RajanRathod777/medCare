// core/app.js
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());


app.use('/api/v1', require('./routes/hospital.routes'));
app.use('/api/v1', require('./routes/article.routes'));
app.use('/api/v1', require('./routes/specialist.routes'));
app.use('/api/v1', require('./routes/medicationReminderRoutes'));

module.exports = app;

