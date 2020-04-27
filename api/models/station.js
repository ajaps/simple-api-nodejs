class Station {
  stationTableDDL = `CREATE TABLE stations(id SERIAL PRIMARY KEY, name VARCHAR(40) not null UNIQUE, type INTEGER not null, orbit INTEGER not null); INSERT INTO stations (name, type, orbit) VALUES ('Abuja', 1, 1), ('Spock', 1, 2), ('International Space Station', 2, 1), ('Moon', 1, 1);`;
}
module.exports = Station;
