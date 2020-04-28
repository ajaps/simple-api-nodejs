require('dotenv').config()

module.exports = {
  development: {
    database: process.env.DEV_DATABASE,
    port: 5432,
    user: "postgres",
  },
  test: {
    database: process.env.TEST_DATABASE,
    port: 5432,
    user: "postgres",
  },
};
