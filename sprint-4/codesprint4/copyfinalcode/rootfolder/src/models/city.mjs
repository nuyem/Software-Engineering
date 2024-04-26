// city.mjs
import DatabaseService from "../services/database.service.mjs";

export default class City {
  constructor(id, name, countryCode, district, population) {
    this.id = id;
    this.name = name;
    this.countryCode = countryCode;
    this.district = district;
    this.population = population;
  }
  
  static async allCitiesSortedByPopulation(db) {
    const sql = "SELECT * FROM city ORDER BY population DESC";
    return db.query(sql);
  }

  // Method to fetch city report data
  static async getCityReport(db) {
    const sql = "SELECT name, (SELECT country.name FROM country WHERE country.code = city.countryCode) AS country, district, population FROM city";
    return db.query(sql);
  }

  static async allCitiesSortedByPopulation(db) {
    const sql = "SELECT * FROM city ORDER BY population DESC";
    return db.query(sql);
  }

  static async citiesInContinentSortedByPopulation(continent, db) {
    const sql = `
      SELECT city.* FROM city
      JOIN country ON city.countryCode = country.code
      WHERE country.continent = ?
      ORDER BY city.population DESC`;
    return db.query(sql, [continent]);
  }

  static async citiesInRegionSortedByPopulation(region, db) {
    const sql = `
      SELECT city.* FROM city
      JOIN country ON city.countryCode = country.code
      WHERE country.region = ?
      ORDER BY city.population DESC`;
    return db.query(sql, [region]);
  }

  static async topNCitiesInWorld(n, db) {
    const sql = "SELECT * FROM city ORDER BY population DESC LIMIT ?";
    return db.query(sql, [n]);
  }

  static async topNCitiesInContinent(n, continent, db) {
    const sql = `
      SELECT city.* FROM city
      JOIN country ON city.countryCode = country.code
      WHERE country.continent = ?
      ORDER BY city.population DESC
      LIMIT ?`;
    return db.query(sql, [continent, n]);
  }

  static async topNCitiesInRegion(n, region, db) {
    const sql = `
      SELECT city.* FROM city
      JOIN country ON city.countryCode = country.code
      WHERE country.region = ?
      ORDER BY city.population DESC
      LIMIT ?`;
    return db.query(sql, [region, n]);
  }
}
