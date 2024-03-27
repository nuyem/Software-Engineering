// Import express.js
const express = require("express");
const db = require('./services/db');

// Create express app
const app = express();

// Set views directory to "views"
app.set('views', './views');

// Set Pug as the view engine
app.set('view engine', 'pug');

// Add static files location
app.use(express.static("static"));

// Route for the root path
app.get("/", function(req, res) {
    res.send("Welcome to my website!");
});

// Route for country report
app.get("/country-report", async function(req, res) {
    try {
        const countries = await db.getCountries();
        res.render("country-report", { countries: countries });
    } catch (error) {
        console.error("Error fetching countries:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route for city report
app.get("/city-report", async function(req, res) {
    try {
        const cities = await db.getCities();
        res.render("city-report", { cities: cities });
    } catch (error) {
        console.error("Error fetching cities:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route for population report
app.get("/population-report", async function(req, res) {
    try {
        const populationReports = await db.getPopulationReports();
        res.render("population-report", { populationReports: populationReports });
    } catch (error) {
        console.error("Error fetching population reports:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Start server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
