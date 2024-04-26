import express from 'express';
import path from 'path';
import DatabaseService from './services/database.service.mjs';
import City from './models/city.mjs';
import Country from './models/country.mjs';

const app = express();

// Set Pug as the view engine and define the views directory
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'static')));

// Connect to the database
const dbService = await DatabaseService.connect();

// Root route
app.get('/', async (req, res) => {
  res.render('index', { title: 'Home Page' });
});

// Route for cities
app.get('/cities', async (req, res) => {
  const cities = await City.allCitiesSortedByPopulation(dbService);
  res.render('cities', { title: 'List of Cities', cities });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
