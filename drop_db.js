require('dotenv').config()
const pgtools = require('pgtools');
database_name = process.env.TEST_DATABASE || 'space_odyssey-test'

const config = {
  database: "postgres",
  port: 5432,
  user: "postgres"
};

// pgtools.dropdb(config, database_name, (err, res) => {
//   if (err) {
//     console.error(err);
//     process.exit(-1);
//   }
//   console.log(res);
// });
