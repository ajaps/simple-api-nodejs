const express = require('express');
const bodyParser = require("body-parser");
var travelBooking = require('./api/router/travel')

// const expressValidator = require('express-validator')
// const { check, validationResult } = require('express-validator');

app = express();
port = process.env.port || 3005;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use('/', travelBooking)

app.listen(port);

console.log("Space travel server started on" + port);
