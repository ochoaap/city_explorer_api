'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { response, request } = require('express');
const app = express();
const superagent = require('superagent');


const PORT = process.env.PORT || 3000;
app.use(cors());

app.get('/', (request, response) => {
  response.send('Hello World');
});

//route 
app.get('/location', (request, response) => {
  let city = request.query.city;
  let key = process.env.GEOCODE_API_KEY;
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  console.log(url);

  superagent.get(url)
    .then(data => {
      console.log(data.body);
      const locationData = data.body;
      const locationHandler = new Location(city, locationData);

      response.status(200).send(locationHandler)
    });

});



app.get('/weather', weatherHandler);
app.get('/location', locationHandler);


// function handlers


function locationHandler(request, response) {
  const geoData = require(`./data/location.json`);
  const city = request.query.city;
  const locationData = new Location(city, geoData);

  response.send(locationData);
}

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

function weatherHandler(request, response) {
  let key = process.env.WEATHER_API_KEY;
  let lon = request.query.longitude
  let lat = request.query.latitude
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;


  superagent.get(url)
    .then(data => {
      console.log(data.body);
      let weatherArr = data.body.data.map(weatherData => {
        return new Weather(weatherData)
      });


      response.status(200).send(weatherArr);

    })
    .catch(error => {
      console.log(error);
    });
}


function Weather(weather) {
  this.forecast = weather.description;
  this.time = weather.valid_date;
this.forecast = weather.weather.description;
this.time = weather.valid_date;  
};


app.use('*', (request, respond) => {
  respond.status(500).send("Sorry, something went wrong.");
});
app.listen(PORT, () => {
  console.log(`Now listening on PORT,${PORT}`);
});

