const express = require('express');
const cors = require('cors');
const appRoutes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(appRoutes);

module.exports = app;