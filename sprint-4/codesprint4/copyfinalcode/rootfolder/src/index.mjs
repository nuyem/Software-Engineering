/* Import dependencies */
import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import DatabaseService from "./services/database.service.mjs";
import session from "express-session";

/* Create express instance */
const app = express();
const port = 3000;

/* Add form data middleware */
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "verysecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Integrate Pug with Express
app.set("view engine", "pug");

// Serve assets from 'static' folder
app.use(express.static("static"));

const db = await DatabaseService.connect();
const { conn } = db;

app.get("/reports", (req, res) => {
  res.render("reports");
});

// Route to handle report generation
app.get("/generate-report", async (req, res) => {
  const reportType = req.query.reportType;
  let data = [];

  switch (reportType) {
    case 'country-report':
      data = await Country.getCountryReport(db);
      break;
    case 'city-report':
      data = await City.getCityReport(db);
      break;
    case 'capital-city-report':
      data = await City.getCapitalCityReport(db);
      break;
    // Add cases for other types of reports
  }

  // Render the report result view with the data
  res.render('report-result', { title: `${reportType}`, data });
});

/* Landing route */
app.get("/", (req, res) => {
  res.render("index");
});

// Sample API route
app.get("/reports", (req, res) => {
  res.render("reports");
});

// Landing route
app.get("/", (req, res) => {
  res.render("index");
});

// Gallery route
app.get("/gallery", (req, res) => {
  res.render("gallery");
});

// About route
app.get("/about", (req, res) => {
  res.render("about", { title: "Boring about page" });
});

app.get("/cities", async (req, res) => {
  const [rows, fields] = await db.getCities();
  /* Render cities.pug with data passed as plain object */
  return res.render("cities", { rows, fields });
});

app.get("/cities/:id", async (req, res) => {
  const cityId = req.params.id;
  const city = await db.getCity(cityId);
  return res.render("city", { city });
});

/* Update a city by ID */
app.post("/cities/:id", async (req, res) => {
  const cityId = req.params.id;
  const { name } = req.body;
  const sql = `
    UPDATE city
    SET Name = '${name}'
    WHERE ID = '${cityId}';
  `;
  await conn.execute(sql);
  return res.redirect(`/cities/${cityId}`);
});

// Returns JSON array of cities
app.get("/api/cities", async (req, res) => {
  const cities = await db.getCities();
  res.send(cities);
});

app.get("/api/countries", async (req, res) => {
  const countries = await db.getCountries();
  res.send(countries);
});

/* Authentication */

// Register
app.get("/register", (req, res) => {
  res.render("register");
});

// Login
app.get("/login", (req, res) => {
  res.render("login");
});

// Account
app.get("/account", async (req, res) => {
  const { auth, userId } = req.session;

  if (!auth) {
    return res.redirect("/login");
  }

  const sql = `SELECT id, email FROM user WHERE user.id = ${userId}`;
  const [results, cols] = await conn.execute(sql);
  const user = results[0];

  res.render("account", { user });
});

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const sql = `INSERT INTO user (email, password) VALUES ('${email}', '${hashed}')`;
    const [result, _] = await conn.execute(sql);
    const id = result.insertId;
    req.session.auth = true;
    req.session.userId = id;
    return res.redirect("/account");
  } catch (err) {
    console.error(err);
    return res.status(400).send(err.sqlMessage);
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).send("Missing credentials");
  }

  const sql = `SELECT id, password FROM user WHERE email = '${email}'`;
  const [results, cols] = await conn.execute(sql);

  const user = results[0];

  if (!user) {
    return res.status(401).send("User does not exist");
  }

  const { id } = user;
  const hash = user?.password;
  const match = await bcrypt.compare(password, hash);

  if (!match) {
    return res.status(401).send("Invalid password");
  }

  req.session.auth = true;
  req.session.userId = id;

  return res.redirect("/account");
});


// Run server!
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
