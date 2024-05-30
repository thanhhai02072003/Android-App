const Pool = require("pg").Pool;

const db_config = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "123456",
  database: "smartfarm",
});

module.exports = db_config;
