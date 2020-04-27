const flight_history = require("./api/models/flight_history");

const { Client } = require('pg');

var client = new Client({
  database: "space_odyssey",
  port: 5432,
  user: "postgres"
});
client.connect();

console.log(new flight_history().flightHistoryTableDDL)
client.query(new flight_history().flightHistoryTableDDL, (err, res) => {
  console.log(err, res);
  client.end();
});
