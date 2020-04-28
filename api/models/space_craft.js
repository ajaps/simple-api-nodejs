class Spacecraft {
  spacecraftTableDDl = "CREATE TABLE IF NOT EXISTS spacecrafts(id SERIAL PRIMARY KEY, name character varying not null UNIQUE, flight_class INTEGER not null); INSERT INTO spacecrafts (name, flight_class) VALUES ('Falcon 1', 1), ('Falcon 9', 2);"
}

module.exports = Spacecraft;
