const express = require('express');
const path = require('path');

const knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : 'France98',
    database : 'usmnt'
  }
});

const app = express();

app.use(express.static('public'));

app.get('/topten', (req, res) => {
  knex.select('first_name', 'last_name', 'current_count')
    .from('twitter_followers')
    .whereNotNull('twitter_name')
    .orderBy('current_count', 'desc')
    .limit(10)
    .then( (data) => {
      res.send(JSON.stringify(data));
      console.log('request for top ten');
    });
});

app.listen(3000);