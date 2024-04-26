import mysql from "mysql2/promise";
import City from "../models/city.mjs";
import Country from "../models/country.mjs";

export default class DatabaseService {
  conn;

  constructor(conn) {
    this.conn = conn;
  }

  /* Establish database connection and return the instance */
  static async connect() {
    const conn = await mysql.createConnection({
      host: process.env.DATABASE_HOST || "localhost",
      user: "user",
      password: "password",
      database: "world",
    });
    return new DatabaseService(conn);
  }

  /* Existing method to get a list of all cities */
  async getCities() {
    try {
      const query = `SELECT city.* FROM city`;
      const [results] = await this.conn.execute(query);
      return results.map(row => new City(row.ID, row.Name, row.CountryCode, row.District, row.Population));
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  /* Existing method to get a particular city by ID, including country information */
  async getCity(cityId) {
    const sql = `
      SELECT city.*, country.Name AS Country, country.Region, country.Continent, country.Population as CountryPopulation
      FROM city
      INNER JOIN country ON country.Code = city.CountryCode
      WHERE city.ID = ${cityId}
    `;
    const [rows] = await this.conn.execute(sql);
    if (rows.length) {
      const data = rows[0];
      const city = new City(
        data.ID,
        data.Name,
        data.CountryCode,
        data.District,
        data.Population
      );
      const country = new Country(
        data.Code,
        data.Country,
        data.Continent,
        data.Region,
        data.CountryPopulation
      );
      city.country = country;
      return city;
    }
    return null;
  }

  /* Existing method to delete a city by ID */
  async removeCity(cityId) {
    const [result] = await this.conn.execute(`DELETE FROM city WHERE ID = ${cityId}`);
    return result;
  }

  /* Existing method to get a list of all countries */
  async getCountries() {
    const sql = `SELECT * FROM country`;
    const [results] = await this.conn.execute(sql);
    return results.map(row => new Country(row.Code, row.Name, row.Continent, row.Region, row.Population));
  }

  // New generic query method to execute any SQL query with parameters
  async query(sql, params = []) {
    try {
      const [results] = await this.conn.execute(sql, params);
      return results;
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }
}
