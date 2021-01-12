'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { response, request } = require('express');
const app = express();
const superagent = require('superagent');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT || 3000;

client.on('error', err => {
  throw err;
});

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Now Listening to PORT, ${PORT}`)
      console.log(`Connected to database ${client.connectionParameters.database}`);
    })
  })
  .catch(err => console.log(err));






app.use(cors());


app.get('/', (request, response) => {
  response.send('Hello World');
});

app.get('/location', (request, response) => {
  let city = request.query.city;
  let key = process.env.GEOCODE_API_KEY;
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  console.log(url);

  client.query(`SELECT * FROM location WHERE search_query= $1`, [city])
    .then(data => {
      if (data.rowCount) {
        response.status(200).send(data.rows[0]);
      }
      else {
        superagent.get(url)
          .then(data => {
            console.log(data.body);
            const locationData = data.body;
            const locationHandler = new Location(city, locationData);

            let SQL = 'INSERT INTO location (formatted_query, search_query, latitude, longitude) VALUES ($1, $2, $3, $4)';
            let safeValues = [locationHandler.formatted_query, locationHandler.search_query, locationHandler.latitude, locationHandler.longitude];

            client.query(SQL, safeValues)
              .then(() => {
                response.status(200).json(locationHandler);
              })
              .catch(error => {
                console.log(error);
              });

          });
      }

    })



});

app.get('/weather', weatherHandler);
// app.get('/location', locationHandler);


app.get(`/add`, (request, response) => {
  console.log(request.query);
  let location = request.query.location;
  let weather = request.query.weather;

});


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
      let weatherArr = data.body.data.map(weatherData => {
        console.log(weatherData.weather)
        return new Weather(weatherData)
      });


      response.status(200).send(weatherArr);

    })
    .catch(error => {
      console.log(error);
    });
}


function Weather(weather) {
  this.forecast = weather.weather.description;
  this.time = weather.valid_date;
};


app.use('*', (request, respond) => {
  respond.status(500).send("Sorry, something went wrong.");
});

