require('dotenv').config()
const pgp = require('pg-promise')( /* initialization options */ );
database_name = process.env.NODE_ENV == 'test' ? process.env.TEST_DATABASE : process.env.DEV_DATABASE

const db = pgp({
  database: "postgres",
  port: 5432,
  user: "postgres"
});

db.none("CREATE DATABASE $1:name", process.env.DEV_DATABASE)
  .then((data) => {
    console.log("Dev Database successfully created");
  })
  .catch((error) => {
    console.log(error);
  });

db.none("CREATE DATABASE $1:name", process.env.TEST_DATABASE)
  .then((data) => {
    console.log("Test Database successfully created");
  })
  .catch((error) => {
    console.log(error);
  });
