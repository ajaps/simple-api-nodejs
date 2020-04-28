class FlightHistory {
  flightHistoryTableDDL = `CREATE TABLE IF NOT EXISTS flight_histories(id SERIAL PRIMARY KEY, user_id integer REFERENCES users, origin_id integer REFERENCES stations, destination_id integer REFERENCES stations, spacecraft_id bigint REFERENCES spacecrafts, fare INTEGER not null);`;
}

module.exports = FlightHistory
