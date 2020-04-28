const express = require('express');
const bodyParser = require("body-parser");
const travelBooking = require('./api/router/travel')

app = express();
port = process.env.port || 3005;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use('/', travelBooking)

module.exports = app
