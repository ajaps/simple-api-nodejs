
const Pool = require("pg").Pool;
const pool = new Pool({ database: "space_odyssey", port: 5432, user: "postgres" });
const LUXURY = { 1: 'standard', 2: 'luxury'}
const LOCATIONTYPE = {1: 'natural', 2: 'man-made'}

const rollback = function (pool) {
  pool.query('ROLLBACK', function (e) {
    pool.end();
  });
};

const Error = (response, error, description='') => {
  response.json({ messgae: 'Request could not be completed', error, description});
}

const invalidAlphanumeric = (name) => {
  if (name && name.match(/^[0-9a-zA-Z]+$/)) {
    return false
  } else {
    return true
  }
}
const invalidNumber = (number) => {
  if (number && number.match(/^[0-9]+$/) && parseInt(number) > 0) {
    return false
  } else {
    return true
  }
}

const createUser = (request, response) => {
  // validate name = null when 'form-data' is used to pass in info
  // validate name must be alphanumeric
  // validate duplicate name
  const name = request.body.name
  if (invalidAlphanumeric(name)) return Error(response, 'Invalid name', 'name must be alphanumeric - not having special characters ')
  pool.query("INSERT INTO users (name, balance) VALUES ($1, $2)", [name, 0], (error, results) => {
    if (error) {
      return Error(response, error.detail, 'This user already exist, select a differnet name')
    }
    response.json({
      info: "user was created successfully",
      message: {
        name: name
      },
    });
  });
}



// app.post("/users/:name/fund-account", [check("username").exists()], (request, response) => {
const fundAccount = (request, response) => {
const client = new Pool({ database: "space_odyssey", port: 5432, user: "postgres" });

  const name = request.params.name
  const value = request.body.value;
  if (invalidAlphanumeric(name)) return Error(response, 'Invalid name', 'name must be alphanumeric - not having special characters ')
  if (invalidNumber(value)) return Error(response, 'Invalid number', "You must specify a value greater than 0")

  // value must be number and greater than 0
  // name must be valid name
  // user name must exist in the db
  // can you put this in a transcation?

  // transcation
  client.query('BEGIN', function (err, result) {
    if (err) return rollback(client);
    client.query("SELECT * FROM users WHERE name = $1", [name], function (err, results) {
      if (err) return rollback(client);
      const current_value = results.rows[0].balance
      const new_value = current_value + parseInt(value);
      client.query("UPDATE users SET balance = $1 WHERE name = $2", [new_value, name], function (err, results) {
        if (err) return rollback(client);
        client.query('COMMIT', client.end.bind(client));
        response.json({
          balance: new_value,
          info: "User account " + name + " was credited successfully",
        });
      });
    });
  });
};

const checkBalance = (request, response) => {
  const name = request.params.name;
  // User doesn't exist in DB
  // name isn't specified
  if (invalidAlphanumeric(name)) return Error(response, 'Invalid name', "You must specify a user's name")

  pool.query("SELECT * FROM users WHERE name = $1", [name], (error, results) => {
    if (error || results.rows.length == 0) {
      return Error(response, (error && error.detail) || 'User does not exist')
    }
    response.json({
      info: "Available balance for " + name,
      message: {
        balance: results.rows[0].balance
      },
    });
  });
};

const bookFlight = (request, response) => {
  const destination = request.body.destination;
  const origin = request.body.origin;
  const spacecraft = request.body.spacecraft;
  const name = request.params.name;

  let valid_user;
  let valid_stations;
  let valid_spacecraft;
  let fare;

  pool.query("SELECT * FROM users WHERE name = $1", [name], (error, results) => {
    if (error) {
      console.log(error);
      return
    }
    valid_user = results.rows;
    pool.query("SELECT * FROM stations WHERE name = $1 OR name = $2", [origin, destination], (error, results) => {
      if (error) {
        console.log(error);
        return;
      }
      valid_stations = results.rows;
      pool.query("SELECT * FROM spacecrafts WHERE name = $1", [spacecraft], (error, results) => {
        if (error) {
          console.log(error);
          return;
        }
        valid_spacecraft = results.rows;
        let user_id = 1,
          origin_id = 1,
          destination_id = 2,
          space_craft_id = 1;
        let fare = calculate_fare(valid_stations[1], valid_stations[0], valid_spacecraft[0])
        let new_balance = valid_user[0].balance - fare
        if (valid_spacecraft && valid_stations && valid_user && (new_balance >= 0)) {
          pool.query("INSERT INTO flight_histories (user_id, origin_id, destination_id, spacecraft_id, fare) VALUES ($1, $2, $3, $4, $5)", [user_id, origin_id, destination_id, space_craft_id, fare || 0], (error, results) => {
            if (results) {
              pool.query("UPDATE users SET balance = $1 WHERE name = $2", [new_balance, name], (error, results) => {
                if (results) {
                  response.json({
                    info: "Flight details",
                    origin,
                    destination,
                    spacecraft: valid_spacecraft[0].name,
                    fare,
                  });
                };
              });
            }
          });
        }
      });
    });
  });
};

const calculate_fare = (origin, destination, spacecraft) => {
  total_cost = 0
  if (origin.orbit != destination.orbit) {
    total_cost += 250
  } else {
    total_cost += 50
  }

  if (spacecraft.flight_class == 'luxury') {
    console.log(LOCATIONTYPE[spacecraft.flight_class])
    total_cost *= 2
  }

  if (destination.location_type == 'man_made') {
    total_cost += 200
  }
  return total_cost;
}

module.exports = {
  createUser,
  fundAccount,
  checkBalance,
  bookFlight,
}
