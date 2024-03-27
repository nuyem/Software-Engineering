require("dotenv").config();
const mysql = require('mysql2/promise');

const config = {
  db: {
    host: process.env.DB_CONTAINER,
    port: process.env.DB_PORT,
    user: process.env.MYSQL_ROOT_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0,
  },
};

const pool = mysql.createPool(config.db);

async function query(sql, params) {
  const [rows, fields] = await pool.execute(sql, params);
  return rows;
}

async function getCountries() {
  const sql = "SELECT * FROM countries"; // Adjust SQL query as per your database schema
  return query(sql);
}

async function getCities() {
  const sql = "SELECT * FROM cities"; // Adjust SQL query as per your database schema
  return query(sql);
}

async function getPopulationReports() {
  const sql = "SELECT * FROM population_reports"; // Adjust SQL query as per your database schema
  return query(sql);
}

module.exports = {
  getCountries,
  getCities,
  getPopulationReports
};
