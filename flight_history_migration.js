const flight_history = require("./api/models/flight_history");
const db_connect = require('./db_connect');
const client = new db_connect()

client.query(new flight_history().flightHistoryTableDDL, (err, res) => {
  console.log(err);
  client.end();
});
