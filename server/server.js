'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { response } = require('express');



const app = express();
const PORT = process.env.PORT;
app.use(cors());

app.get('/', (request, response) => {
  response.send('Hello World');
});

app.get('/location', locationHandler);

app.use('*', (request, response)=> {
  response.send('404, Sorry!');
});

app.listen(PORT, () => {
  console.log(`Now listening on port, ${PORT}`);
});

function locationHandler(request,response){
  const geoData = require(`data/location.json`);
  const city = request.query.city;
  const locationData = new Location(city, geoData);

  response.send(locationData);
}

function location (city, geoData) {
  this.search.query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}