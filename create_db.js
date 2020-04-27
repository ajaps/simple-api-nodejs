const pgp = require('pg-promise')( /* initialization options */ );

const db = pgp({
  database: "postgres",
  port: 5432,
  user: "postgres"
});

db.none("CREATE DATABASE $1:name", "space_odyssey")
  .then((data) => {
    console.log("Database successfully created");
  })
  .catch((error) => {
    console.log(error);
  });
