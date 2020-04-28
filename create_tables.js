const stattion = require("./api/models/station");
const spacescraft = require("./api/models/space_craft");
const user = require("./api/models/user");

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
  client.query(new stattion().stationTableDDL, [], (err, result) => {
    if (err) return rollback(client);
    client.query(new spacescraft().spacecraftTableDDl, [], (err, result) => {
    if (err) return rollback(client);
      client.query(new user().userTableDDL, [], (err, result) => {
        if (err) return rollback(client);
        client.query('COMMIT', client.end.bind(client));
      })
    });
  });
});
