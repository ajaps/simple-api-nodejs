class Spacecraft {
  spacecraftTableDDl = "CREATE TABLE spacecrafts(id SERIAL PRIMARY KEY, name VARCHAR(40) not null UNIQUE, flight_class INTEGER not null); INSERT INTO spacecrafts (name, flight_class) VALUES ('Falcon 1', 1), ('Falcon 9', 2);"

}

module.exports = Spacecraft;
