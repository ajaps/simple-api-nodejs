const db_connect = require('../../db_connect');
const pool = new db_connect()
const LUXURY = { 1: 'standard', 2: 'luxury'}, LOCATIONTYPE = { 1: 'natural', 2: 'man-made' }

const rollback = (response, pool, error) => {
  pool.query('ROLLBACK', (e) => {
    pool.end();
    response.json({ message: 'An unexpected error occured, the request was not completed', error});
  });
};

const Error = (response, error, description='') => {
  response.json({ message: 'Request could not be completed', error, description});
}

const invalidAlphanumeric = (name) => {
  if (name && typeof name == 'string' && name.match(/^[0-9a-zA-Z]+$/)) {
    return false
  } else {
    return true
  }
}
const invalidNumber = (number) => {
  if (number && typeof number == 'number' && parseInt(number) > 0) {
    return false
  } else {
    return true
  }
}

const createUser = (request, response) => {
  const name = request.body.name
  if (invalidAlphanumeric(name)) return Error(response, 'Invalid name', 'name must be alphanumeric - not having special characters')
  pool.query("INSERT INTO users (name, balance) VALUES ($1, $2)", [name.toLowerCase(), 0], (error, results) => {
    if (error) {
      return Error(response, error.detail, 'This user already exist, select a differnet name')
    }
    response.status(201).json({
      info: "user was created successfully",
      name,
    });
  });
}

const fundAccount = (request, response) => {
  const client = new db_connect()
  const name = request.params.name, value = request.body.value;

  if (invalidAlphanumeric(name)) return Error(response, 'Invalid name', 'name must be alphanumeric - not having special characters ')
  if (invalidNumber(value)) return Error(response, 'Invalid number', "You must specify a value greater than 0")

  // transcation
  client.query('BEGIN', (err, _result) => {
    if (err) return rollback(response, err, client);
    client.query("SELECT * FROM users WHERE lower(name) = $1", [name.toLowerCase()], (err, results) => {
      if (err || results.rows.length == 0) {
        return Error(response, (err && error.detail) || 'User does not exist')
      }
      const current_value = results.rows[0].balance
      const new_value = current_value + parseInt(value);
      client.query("UPDATE users SET balance = $1 WHERE lower(name) = $2", [new_value, name.toLowerCase()], (err, results) => {
        if (err) return rollback(response, err, client);
        client.query('COMMIT', client.end.bind(client));
        response.status(201).json({
          balance: new_value + ' BTC',
          info: "User account " + name + " was credited successfully",
        });
      });
    });
  });
};

const checkBalance = (request, response) => {
  const name = request.params.name;

  pool.query("SELECT * FROM users WHERE lower(name) = $1", [name.toLowerCase()], (error, results) => {
    if (error || results.rows.length == 0) {
      return Error(response, (error && error.detail) || 'User does not exist')
    }
    response.status(400).json({
      info: "Available balance for " + name,
      balance: results.rows[0].balance + " BTC",
    });
  });
};

const bookFlight = (request, response) => {
  const destination = request.body.destination;
  const origin = request.body.origin;
  const spacecraft = request.body.spacecraft;
  const name = request.params.name;

  if (invalidAlphanumeric(name)) return Error(response, 'Invalid name', "You must specify a user's name")
  if (destination == origin) return Error(response, 'Your origin and destination should not be the same', "Select a different destination")

  let valid_user, valid_stations, valid_spacecraft;

  pool.query("SELECT * FROM users WHERE lower(name) = $1", [name.toLowerCase()], (error, results) => {
    if (error || results.rows.length == 0) {
      return Error(response, (error && error.detail) || 'User does not exist')
    }
    valid_user = results.rows;
    pool.query("SELECT * FROM stations WHERE lower(name) = $1 OR lower(name) = $2", [origin.toLowerCase(), destination.toLowerCase()], (error, results) => {
      if (error || results.rows.length < 2) {
        return Error(response, (error && error.detail) || 'One or both station does not exist, vist /stations for available stations')
      }
      valid_stations = results.rows;
      pool.query("SELECT * FROM spacecrafts WHERE lower(name) = $1", [spacecraft.toLowerCase()], (error, results) => {
        if (error || results.rows.length == 0) {
          return Error(response, (error && error.detail) || 'Spacecrafts does not exist')
        }
        valid_spacecraft = results.rows;

        let user_obj = valid_user[0],
          origin_obj = valid_stations[0].name == origin ? valid_stations[0] : valid_stations[1],
          destination_obj = valid_stations[1].name == destination ? valid_stations[1] : valid_stations[0],
          spacecraft_obj = valid_spacecraft[0];
        const fare = calculate_fare(origin_obj, destination_obj, spacecraft_obj)
        const new_balance = valid_user[0].balance - fare

        if (new_balance >= 0) {
          const client = new db_connect()

          client.query('BEGIN', (err, _result) => {
            if (err) return rollback(response, err, client);
            client.query("INSERT INTO flight_histories (user_id, origin_id, destination_id, spacecraft_id, fare) VALUES ($1, $2, $3, $4, $5)", [user_obj.id, origin_obj.id, destination_obj.id, spacecraft_obj.id, fare], (err, _results) => {
              if (err) return rollback(response, err, client);
              client.query("UPDATE users SET balance = $1 WHERE lower(name)= $2", [new_balance, name.toLowerCase()], (err, _results) => {
                if (err) return rollback(response, err, client);
                client.query('COMMIT', client.end.bind(client));
                response.status(201).json({
                  info: "Your flight was successfully booked, see flight details below",
                  details: {
                    origin: origin_obj.name,
                    destination: destination_obj.name,
                    spacecraft: spacecraft_obj.name,
                    fare,
                  }
                });
              });
            });
          });
        }
        else {
          response.status(401).json({
            error: "Your account balance is low - You do not have enough funds to complete this transcation",
            message: "You need at least " + fare + " BTC to complete this transcation",
          });
        }
      });
    });
  });
};

const displayStations = (request, response) => {
  pool.query("SELECT * FROM stations", [], (error, results) => {
    if (error) {
      return Error(response, error.detail, 'Could not retrieve stations, please try again')
    }
    response.json({
      info: "Available stations",
      stations: results.rows
    });
  });
}
const displaySpacecrafts = (request, response) => {
  pool.query("SELECT * FROM spacecrafts", [], (error, results) => {
    if (error) {
      return Error(response, error.detail, 'Could not retrieve stations, please try again')
    }
    response.json({
      info: "Available spacecrafts",
      spacecrafts: results.rows,
    });
  });
}

const calculate_fare = (origin, destination, spacecraft) => {
  total_cost = 0;

  if (origin.orbit != destination.orbit) {
    total_cost += 250;
  } else {
    total_cost += 50;
  }
  if (LUXURY[spacecraft.flight_class] == "luxury") {
    total_cost *= 2;
  }
  if (LOCATIONTYPE[destination.type] == "man-made") {
    total_cost += 200;
  }
  return total_cost;
};

module.exports = {
  createUser, fundAccount, checkBalance, bookFlight, displayStations, displaySpacecrafts
}
