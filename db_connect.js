require("dotenv").config();

const Pool = require("pg").Pool;
envConfigs = require('./db_config')
const env = process.env.NODE_ENV || 'development';
const config = envConfigs[env];

class DbConnect {
  constructor(){
    return new Pool(config);
  }
}

module.exports = DbConnect
