const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config(); // Load .env variables

const app = express();
const PORT = 3000;

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const CUSTOM_OBJECT_NAME = 'names'; // your custom object internal name

// ROUTE 1: Homepage - list all custom object records
app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_NAME}?properties=name,publisher,price`;
  const headers = {
    Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.get(url, { headers });
    const records = response.data.results;
    res.render('homepage', { title: 'Custom Object Records', records });
  } catch (error) {
    console.error('Error fetching records:', error.response?.data || error.message);
    res.status(500).send('Failed to load records.');
  }
});

// ROUTE 2: Form to add new custom object record
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

// ROUTE 3: Handle form submission to create a record
app.post('/update-cobj', async (req, res) => {
  const { name, publisher, price } = req.body;

  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_NAME}`;
  const headers = {
    Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  };

  const data = {
    properties: {
      name,
      publisher,
      price
    }
  };

  try {
    console.log('Submitting this to HubSpot:', data);
    await axios.post(url, data, { headers });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating record:', error.response?.data || error.message);
    res.status(500).send('Failed to create record.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
