//  clear tables on test DB in preparation for tests(pre-test)
const db_connect = require('./db_connect');
const client = new db_connect()

const rollback = (client) => {
  client.query('ROLLBACK', (e) => {
    console.log(e)
    client.end();
  });
};

// Create table
client.query('BEGIN', (err, result) => {
  if (err) return rollback(client);
  client.query('DELETE FROM flight_histories;', [], (err, result) => {
    if (err) return rollback(client);
    client.query('DELETE FROM users;', [], (err, result) => {
      if (err) return rollback(client);
        client.query('COMMIT', client.end.bind(client));
    });
  });
});
