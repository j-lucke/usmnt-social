require('dotenv').config();
const express = require('express');
const path = require('path');

const knex = require('knex')({
  client: 'pg',
  connection: process.env.DB_CONFIG 
});



const app = express();

app.use(express.static('public'));

app.get('/topten', (req, res) => {
  knex.select('first_name', 'last_name', 'current_count')
    .from('twitter_followers')
    .whereNotNull('twitter_name')
    .orderBy('current_count', 'desc')
    .limit(70)
    .then( (data) => {
      res.send(JSON.stringify(data));
      console.log('request for top ten');
    });
});

app.listen(3000);