// const pg = require('pg');
// const connectionString = 'postgres://localhost:5432/space_odyssey';

// const client = new pg.Client(connectionString);
// client.connect();
// const query = client.query(
//   'CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
// query.on('end', () => {
//   client.end();
// });


const { Pool, Client } = require("pg");
// require("dotenv").config();

const pool = new Pool()

const config = {
  database: "space_odyssey",
  port: 5432,
  user: "postgres",
};

// pool.query("SELECT NOW()", (err, res) => {
//   console.log(err, res);
//   pool.end();
// });


const client = new Client(config);
client.connect();

const query = (query_string) => {
  client.query(query_string, (err, res) => {
    console.log(err, res);
    client.end();
  });
}

// query("CREATE TABLE users(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, balance DOUBLE PRECISION)");
// query("CREATE TABLE spacecrafts(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, flight_class INTEGER not null)");
// query("CREATE TABLE stations(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, type INTEGER not null, orbit INTEGER not null)");
// query("CREATE TABLE flight_histories(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, fare DOUBLE PRECISION not null, user_id integer REFERENCES users)");
  spacecraftTableDDl = "CREATE TABLE spacecrafts(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, flight_class INTEGER not null)"
  stationTableDDL = `CREATE TABLE stations(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, type INTEGER not null, orbit INTEGER not null)`
  flightHistoryTableDDL = `CREATE TABLE flight_histories(id SERIAL PRIMARY KEY, user_id integer REFERENCES users, origin_id integer REFERENCES stations, destination_id integer REFERENCES stations, spacecraft_id bigint REFERENCES spacecrafts, fare numeric(15, 2), created_at timestamp(6) without time zone NOT NULL, updated_at timestamp(6) without time zone NOT NULL);`
  userTableDDL = `CREATE TABLE users (id SERIAL PRIMARY KEY, name character varying, balance numeric(15,2), created_at timestamp(6) without time zone NOT NULL, updated_at timestamp(6) without time zone NOT NULL);`

// query("DROP TABLE stations");
// query("DROP TABLE spacecrafts");
// query(flightHistoryTableDDL);

// item_code integer REFERENCES items

// client.query(
//   "CREATE TABLE users(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)",
//   [],
//   (err, res) => {
//     console.log(err ? err.stack : res.rows); // Hello World!
//     client.end();
//   }
// );

// client.query(
//   "CREATE TABLE space_crafts(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)",
//   [],
//   (err, res) => {
//     console.log(err ? err.stack : res.rows); // Hello World!
//     client.end();
//   }
// );

// client.query(
//   "CREATE TABLE stations(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)",
//   [],
//   (err, res) => {
//     console.log(err ? err.stack : res.rows); // Hello World!
//     client.end();
//   }
// );

// client.query(
//   "CREATE TABLE flight_histories(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)",
//   [],
//   (err, res) => {
//     console.log(err ? err.stack : res.rows); // Hello World!
//     client.end();
//   }
// );
