'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { response } = require('express');
const app = express();


const PORT = process.env.PORT || 3000;
app.use(cors());

app.get('/', (request, response) => {
  response.send('Hello World');
});

//route 
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.use('*', (request, response)=> {
  response.send('404, Sorry!');
});



// function handlers


function locationHandler(request,response){
  const geoData = require(`../data/location.json`);
  const city = request.query.city;
  const locationData = new Location(city, geoData);

  response.send(locationData);
}

function Location (city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

function weatherHandler (request, response) {
  const weather = require('../data/weather.json');
  console.log('weather', weather);
  const weatherArr = [];
  weather.data.forEach( weatherInfo => {
    console.log('weatherInfo', weatherInfo);
    weatherArr.push(new Weather(weatherInfo));
  });
  response.send(weatherArr);
};


function Weather(weather) {
this.forecast = weather.weather.descriptiion;
this.time = weather.valid_date;  
};


app.use('*', (request, respond)=>{
  respond.status(500).send("Sorry, something went wrong.");
});
app.listen(PORT, ()=>{
  console.log(`Now listening on PORT,${PORT}`);
});

