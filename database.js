const stattion = require("./api/models/station");
const spacescraft = require("./api/models/space_craft");
const user = require("./api/models/user");

const { Client } = require('pg');

var client = new Client({ database: "space_odyssey", port: 5432, user: "postgres" });
client.connect();

const rollback = function (client) {
  //terminating a client connection will
  //automatically rollback any uncommitted transactions
  //so while it's not technically mandatory to call
  //ROLLBACK it is cleaner and more correct
  client.query('ROLLBACK', function (e) {
    console.log(e)
    client.end();
  });
};

// Create table
client.query('BEGIN', function (err, result) {
  if (err) return rollback(client);
  client.query(new stattion().stationTableDDL, [], function (err, result) {
    if (err) return rollback(client);
    client.query(new spacescraft().spacecraftTableDDl, [], function (err, result) {
    if (err) return rollback(client);
      client.query(new user().userTableDDL, [], function (err, result) {
        if (err) return rollback(client);
        client.query('COMMIT', client.end.bind(client));
      })
    });
  });
});
