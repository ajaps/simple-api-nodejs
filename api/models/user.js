class User {
  userTableDDL = `CREATE TABLE users (id SERIAL PRIMARY KEY, name character varying UNIQUE NOT NULL, balance INTEGER NOT NULL); INSERT INTO users (name, balance) VALUES ('frank', 3000);`;

  insert = (pool, data) => {
    pool.query(
      "INSERT INTO users (name, balance) VALUES ($1, $2)",
      data,
      (error, results) => {
        if (error) {
          throw error;
        }
        results.rows;
      }
    );
  };

  results;
}

module.exports = User
