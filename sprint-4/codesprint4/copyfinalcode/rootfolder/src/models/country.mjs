// country.mjs
import DatabaseService from "../services/database.service.mjs";

export default class Country {
  constructor(code, name, continent, region, population) {
    this.code = code;
    this.name = name;
    this.continent = continent;
    this.region = region;
    this.population = population;
  }

  static async getCountryReport(db) {
    const sql = `
      SELECT c.code, c.name, c.continent, c.region, c.population, ci.name AS capital
      FROM country c
      LEFT JOIN city ci ON c.capital = ci.id
      ORDER BY c.population DESC`;
    return await db.query(sql);

  }

  static async allCountriesSortedByPopulation(db) {
    const sql = "SELECT * FROM country ORDER BY population DESC";
    return db.query(sql);
  }

  static async countriesInContinentSortedByPopulation(continent, db) {
    const sql = "SELECT * FROM country WHERE continent = ? ORDER BY population DESC";
    return db.query(sql, [continent]);
  }

  static async countriesInRegionSortedByPopulation(region, db) {
    const sql = "SELECT * FROM country WHERE region = ? ORDER BY population DESC";
    return db.query(sql, [region]);
  }

  static async topNCountriesInWorld(n, db) {
    const sql = "SELECT * FROM country ORDER BY population DESC LIMIT ?";
    return db.query(sql, [n]);
  }

  static async topNCountriesInContinent(n, continent, db) {
    const sql = "SELECT * FROM country WHERE continent = ? ORDER BY population DESC LIMIT ?";
    return db.query(sql, [continent, n]);
  }

  static async topNCountriesInRegion(n, region, db) {
    const sql = "SELECT * FROM country WHERE region = ? ORDER BY population DESC LIMIT ?";
    return db.query(sql, [region, n]);
  }
}
